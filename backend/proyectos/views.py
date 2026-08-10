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

def filtrar_proyectos_por_usuario(queryset, request):
    user = getattr(request, "user", None)
    if user and user.is_authenticated:
        if not (user.is_superuser or getattr(user, "rol", "") == "ADMIN"):
            queryset = queryset.filter(creado_por=user)
    return queryset


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
    search_fields = ['titulo', 'descripcion', 'autor_nombre', 'carrera__nombre']
    ordering_fields = ['created_at', 'titulo']

    def get_queryset(self):
        queryset = super().get_queryset()
        ods_param = self.request.query_params.get('ods')
        if ods_param:
            ods_list = [int(x) for x in ods_param.split(',') if x.isdigit()]
            if ods_list:
                # CORREGIDO: usar ods_relacionados (related_name del modelo ProyectoODS)
                queryset = queryset.filter(ods_relacionados__ods_id__in=ods_list).distinct()
        categoria = self.request.query_params.get('categoria')
        if categoria:
            queryset = queryset.filter(categoria=categoria)
        estado = self.request.query_params.get('estado')
        if estado:
            queryset = queryset.filter(estado_publicacion=estado)
        queryset = filtrar_proyectos_por_usuario(queryset, self.request)
        return queryset

    def perform_create(self, serializer):
        user = getattr(self.request, "user", None)
        if user and user.is_authenticated:
            if not (user.is_superuser or getattr(user, "rol", "") == "ADMIN"):
                serializer.save(creado_por=user)
            else:
                serializer.save(creado_por=serializer.validated_data.get('creado_por', user))
        else:
            serializer.save()


class Proyecto3DViewSet(viewsets.ModelViewSet):
    queryset = Proyecto3D.objects.all().order_by('-created_at')
    serializer_class = Proyecto3DSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['titulo', 'descripcion', 'autor_nombre', 'carrera__nombre']
    ordering_fields = ['created_at', 'titulo']

    def get_queryset(self):
        queryset = super().get_queryset()
        ods_param = self.request.query_params.get('ods')
        if ods_param:
            ods_list = [int(x) for x in ods_param.split(',') if x.isdigit()]
            if ods_list:
                queryset = queryset.filter(ods_relacionados__ods_id__in=ods_list).distinct()
        categoria = self.request.query_params.get('categoria')
        if categoria:
            queryset = queryset.filter(categoria=categoria)
        estado = self.request.query_params.get('estado')
        if estado:
            queryset = queryset.filter(estado_publicacion=estado)
        queryset = filtrar_proyectos_por_usuario(queryset, self.request)
        return queryset

    def perform_create(self, serializer):
        user = getattr(self.request, "user", None)
        if user and user.is_authenticated:
            if not (user.is_superuser or getattr(user, "rol", "") == "ADMIN"):
                serializer.save(creado_por=user)
            else:
                serializer.save(creado_por=serializer.validated_data.get('creado_por', user))
        else:
            serializer.save()


class ProyectoSoftwareViewSet(viewsets.ModelViewSet):
    queryset = ProyectoSoftware.objects.all().order_by('-created_at')
    serializer_class = ProyectoSoftwareSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['titulo', 'descripcion', 'autor_nombre', 'carrera__nombre', 'tecnologias__nombre']
    ordering_fields = ['created_at', 'titulo']

    def get_queryset(self):
        queryset = super().get_queryset()
        ods_param = self.request.query_params.get('ods')
        if ods_param:
            ods_list = [int(x) for x in ods_param.split(',') if x.isdigit()]
            if ods_list:
                queryset = queryset.filter(ods_relacionados__ods_id__in=ods_list).distinct()
        categoria = self.request.query_params.get('categoria')
        if categoria:
            queryset = queryset.filter(categoria=categoria)
        estado = self.request.query_params.get('estado')
        if estado:
            queryset = queryset.filter(estado_publicacion=estado)
        queryset = filtrar_proyectos_por_usuario(queryset, self.request)
        return queryset

    def perform_create(self, serializer):
        user = getattr(self.request, "user", None)
        if user and user.is_authenticated:
            if not (user.is_superuser or getattr(user, "rol", "") == "ADMIN"):
                serializer.save(creado_por=user)
            else:
                serializer.save(creado_por=serializer.validated_data.get('creado_por', user))
        else:
            serializer.save()