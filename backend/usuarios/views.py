from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from usuarios.models import Usuario
from usuarios.serializers import UsuarioSerializer
from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

class UsuarioViewSet(viewsets.ModelViewSet):
    """
    ViewSet general para todos los usuarios. Permite filtrar con ?rol=PROF o ?rol=ADMIN
    """
    queryset = Usuario.objects.all().order_by('-date_joined')
    serializer_class = UsuarioSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'email', 'rol']
    ordering_fields = ['nombre', 'email', 'date_joined', 'updated_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        rol = self.request.query_params.get('rol')
        if rol:
            queryset = queryset.filter(rol=rol.upper())
        return queryset


class EditorViewSet(viewsets.ModelViewSet):
    """
    ViewSet específico para gestionar los Editores (rol='PROF') desde el Panel del Administrador.
    """
    queryset = Usuario.objects.filter(rol='PROF').order_by('-date_joined')
    serializer_class = UsuarioSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'email']
    ordering_fields = ['nombre', 'email', 'date_joined', 'updated_at']

    def perform_create(self, serializer):
        # Asegura que siempre se asigne rol='PROF' al crear desde este endpoint
        serializer.save(rol='PROF')



# View para iniciar sesión
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = (request.data.get('email') or request.data.get('username') or '').strip().lower()
    password = request.data.get('password') or ''

    if not email or not password:
        return Response(
            {"error": "Por favor, ingresa tu correo electrónico y contraseña."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Intentamos autenticar por email o username
    user = authenticate(request, email=email, password=password)
    if user is None:
        user = authenticate(request, username=email, password=password)
    
    if user is None:
        # Verificamos si existe el usuario para dar un mensaje claro si está inactivo
        if Usuario.objects.filter(email=email, is_active=False).exists():
            return Response(
                {"error": "Esta cuenta está inactiva. Consulta con el Administrador General."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        return Response(
            {"error": "Correo electrónico o contraseña incorrectos."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Verificación arquitectónica de roles: No permitir cuentas técnicas (is_superuser/is_staff)
    # y exigir que el usuario pertenezca al plano de negocio de React (ADMIN o PROF).
    if user.is_superuser or user.is_staff or user.rol not in [Usuario.ROL_ADMIN, Usuario.ROL_PROF]:
        return Response(
            {"error": "No tiene permisos para acceder a esta aplicación."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    login(request, user)
    serializer = UsuarioSerializer(user, context={'request': request})
    refresh = RefreshToken.for_user(user)
    return Response({
        "success": True,
        "message": "Inicio de sesión exitoso.",
        "user": serializer.data,
        "token": str(refresh.access_token),
        "refresh": str(refresh)
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def logout_view(request):
    logout(request)
    return Response({"success": True, "message": "Sesión cerrada correctamente."}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def me_view(request):
    if request.user.is_authenticated:
        serializer = UsuarioSerializer(request.user, context={'request': request})
        return Response({"authenticated": True, "user": serializer.data}, status=status.HTTP_200_OK)
    return Response({"authenticated": False, "user": None}, status=status.HTTP_200_OK)


@api_view(['PATCH', 'PUT'])
@permission_classes([AllowAny])
def update_profile_view(request):
    user = request.user
    current_email = request.data.get('current_email', '').strip().lower()
    if not user.is_authenticated:
        if not current_email:
            return Response({"error": "Usuario no autenticado."}, status=status.HTTP_401_UNAUTHORIZED)
        user = Usuario.objects.filter(email=current_email).first()
        if not user:
            return Response({"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)

    nombre = request.data.get('nombre', '').strip()
    email = request.data.get('email', '').strip().lower()

    if not nombre or not email:
        return Response(
            {"error": "El nombre y el correo electrónico son obligatorios."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if email != user.email and Usuario.objects.filter(email=email).exists():
        return Response(
            {"error": "Ya existe otra cuenta registrada con este correo electrónico."},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.nombre = nombre
    user.email = email

    # Manejo de actualización o eliminación de foto de perfil (avatar)
    if 'avatar' in request.FILES:
        user.avatar = request.FILES['avatar']
    elif request.data.get('remove_avatar') in ['true', 'True', True, '1']:
        if user.avatar:
            user.avatar.delete(save=False)
        user.avatar = None

    user.save()
    serializer = UsuarioSerializer(user, context={'request': request})
    return Response({
        "success": True,
        "message": "Perfil actualizado correctamente.",
        "user": serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def change_password_view(request):
    user = request.user
    current_email = request.data.get('current_email', '').strip().lower()
    if not user.is_authenticated:
        if not current_email:
            return Response({"error": "Usuario no autenticado."}, status=status.HTTP_401_UNAUTHORIZED)
        user = Usuario.objects.filter(email=current_email).first()
        if not user:
            return Response({"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND)

    current_password = request.data.get('current_password', '')
    new_password = request.data.get('new_password', '')

    if not current_password or not new_password:
        return Response(
            {"error": "Debes ingresar tu contraseña actual y la nueva contraseña."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not user.check_password(current_password):
        return Response(
            {"error": "La contraseña actual es incorrecta."},
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(new_password) < 6:
        return Response(
            {"error": "La nueva contraseña debe tener al menos 6 caracteres."},
            status=status.HTTP_400_BAD_REQUEST
        )

    user.set_password(new_password)
    user.save()
    update_session_auth_hash(request, user)
    return Response({
        "success": True,
        "message": "Contraseña actualizada correctamente."
    }, status=status.HTTP_200_OK)


