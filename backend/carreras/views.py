from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from carreras.models import Carrera
from carreras.serializers import CarreraSerializer

class EsAdminOMiembroStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        # Solo admin/staff pueden modificar (POST, PUT, DELETE)
        if request.method in SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_authenticated and (
            request.user.rol == 'ADMIN' or request.user.is_staff
        )

class CarreraViewSet(viewsets.ModelViewSet):
    queryset = Carrera.objects.all().order_by('nombre')
    serializer_class = CarreraSerializer
    permission_classes = [IsAuthenticated, EsAdminOMiembroStaff]