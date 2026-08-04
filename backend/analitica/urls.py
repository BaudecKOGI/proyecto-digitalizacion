from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MetricaProyectoViewSet

router = DefaultRouter()
router.register(r'metricas', MetricaProyectoViewSet, basename='metrica-proyecto')

urlpatterns = [
    path('', include(router.urls)),
]
