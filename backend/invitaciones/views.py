from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import InvitacionProyecto
from .serializers import (
    InvitacionCrearSerializer,
    InvitacionEstadoSerializer,
    CompletarProyecto3DSerializer,
    CompletarProyectoSoftwareSerializer,
)


class InvitacionViewSet(viewsets.ModelViewSet):
    queryset = InvitacionProyecto.objects.all()
    lookup_field = 'token'
    lookup_url_kwarg = 'token'

    def get_permissions(self):
        # El alumno abre el link y completa el formulario SIN estar logueado.
        # Crear/listar invitaciones sí requiere sesión del admin.
        if self.action in ['retrieve', 'completar']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'create':
            return InvitacionCrearSerializer
        return InvitacionEstadoSerializer

    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)

    @action(detail=True, methods=['patch'])
    def completar(self, request, token=None):
        invitacion = self.get_object()

        if not invitacion.esta_vigente():
            return Response(
                {"detail": "Este enlace ya venció o ya fue utilizado."},
                status=status.HTTP_410_GONE,
            )

        serializer_class = (
            CompletarProyecto3DSerializer if invitacion.tipo == '3D' else CompletarProyectoSoftwareSerializer
        )
        serializer = serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        proyecto = serializer.save(
            autor_nombre=invitacion.autor_nombre,
            creado_por=invitacion.creado_por,
            estado_publicacion='BORRADOR',
        )

        invitacion.proyecto = proyecto
        invitacion.usado = True
        invitacion.save(update_fields=['proyecto', 'usado'])

        return Response(
            {"detail": "Proyecto enviado correctamente. El administrador lo revisará antes de publicarlo."},
            status=status.HTTP_201_CREATED,
        )