from django.urls import path, include
from rest_framework.routers import DefaultRouter
from carreras.views import CarreraViewSet

router = DefaultRouter()
router.register(r'carreras', CarreraViewSet, basename='carrera')

urlpatterns = [
    path('', include(router.urls)),
]