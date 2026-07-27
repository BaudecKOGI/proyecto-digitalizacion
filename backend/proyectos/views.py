from rest_framework import viewsets, filters
from proyectos.models import Categoria, Proyecto, Proyecto3D
from proyectos.serializers import CategoriaSerializer, ProyectoSerializer, Proyecto3DSerializer

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all().order_by('nombre')
    serializer_class = CategoriaSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre', 'descripcion']

class ProyectoViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.all().order_by('-created_at')
    serializer_class = ProyectoSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['titulo', 'descripcion', 'autor_nombre', 'carrera']
    ordering_fields = ['created_at', 'titulo']

class Proyecto3DViewSet(viewsets.ModelViewSet):
    queryset = Proyecto3D.objects.all().order_by('-created_at')
    serializer_class = Proyecto3DSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['titulo', 'descripcion', 'autor_nombre', 'carrera']
    ordering_fields = ['created_at', 'titulo']

class ProyectoSoftwareViewSet(viewsets.ModelViewSet):
    """
    ViewSet para proyectos digitales y de software.
    """
    queryset = Proyecto.objects.all().order_by('-created_at')
    serializer_class = ProyectoSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['titulo', 'descripcion', 'autor_nombre', 'carrera']
    ordering_fields = ['created_at', 'titulo']
