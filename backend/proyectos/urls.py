from django.urls import path, include
from rest_framework.routers import DefaultRouter
from proyectos.views import (
    CategoriaViewSet, ProyectoViewSet, Proyecto3DViewSet, ProyectoSoftwareViewSet
)

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet, basename='categoria')
router.register(r'proyectos', ProyectoViewSet, basename='proyecto')
router.register(r'proyectos-3d', Proyecto3DViewSet, basename='proyecto-3d')
router.register(r'proyectos-software', ProyectoSoftwareViewSet, basename='proyecto-software')

urlpatterns = [
    path('', include(router.urls)),
]
