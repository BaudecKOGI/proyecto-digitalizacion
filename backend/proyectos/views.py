from rest_framework import viewsets, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status

from proyectos.models import Categoria, Tecnologia, Proyecto, Proyecto3D, ProyectoSoftware
from proyectos.serializers import (
    CategoriaSerializer,
    TecnologiaSerializer,
    ProyectoSerializer,
    Proyecto3DSerializer,
    ProyectoSoftwareSerializer
)

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all().order_by('nombre')
    serializer_class = CategoriaSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre', 'descripcion']


class TecnologiaViewSet(viewsets.ModelViewSet):
    queryset = Tecnologia.objects.all().order_by('nombre')
    serializer_class = TecnologiaSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre', 'slug']


class ProyectoViewSet(viewsets.ModelViewSet):
    queryset = Proyecto.objects.all().order_by('-created_at')
    serializer_class = ProyectoSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['titulo', 'descripcion', 'autor_nombre', 'carrera']
    ordering_fields = ['created_at', 'titulo']

    def get_queryset(self):
        queryset = super().get_queryset()
        ods = self.request.query_params.get('ods')
        if ods:
            queryset = queryset.filter(ods=ods)
        categoria = self.request.query_params.get('categoria')
        if categoria:
            queryset = queryset.filter(categoria=categoria)
        estado = self.request.query_params.get('estado')
        if estado:
            queryset = queryset.filter(estado_publicacion=estado)
        return queryset


class Proyecto3DViewSet(viewsets.ModelViewSet):
    queryset = Proyecto3D.objects.all().order_by('-created_at')
    serializer_class = Proyecto3DSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['titulo', 'descripcion', 'autor_nombre', 'carrera']
    ordering_fields = ['created_at', 'titulo']

    def get_queryset(self):
        queryset = super().get_queryset()
        ods = self.request.query_params.get('ods')
        if ods:
            queryset = queryset.filter(ods=ods)
        categoria = self.request.query_params.get('categoria')
        if categoria:
            queryset = queryset.filter(categoria=categoria)
        estado = self.request.query_params.get('estado')
        if estado:
            queryset = queryset.filter(estado_publicacion=estado)
        return queryset


class ProyectoSoftwareViewSet(viewsets.ModelViewSet):
    """
    ViewSet para proyectos digitales y de software.
    """
    queryset = ProyectoSoftware.objects.all().order_by('-created_at')
    serializer_class = ProyectoSoftwareSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['titulo', 'descripcion', 'autor_nombre', 'carrera', 'tecnologias__nombre']
    ordering_fields = ['created_at', 'titulo']

    def get_queryset(self):
        queryset = super().get_queryset()
        ods = self.request.query_params.get('ods')
        if ods:
            queryset = queryset.filter(ods=ods)
        categoria = self.request.query_params.get('categoria')
        if categoria:
            queryset = queryset.filter(categoria=categoria)
        estado = self.request.query_params.get('estado')
        if estado:
            queryset = queryset.filter(estado_publicacion=estado)
        return queryset
