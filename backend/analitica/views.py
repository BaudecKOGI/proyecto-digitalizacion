from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import MetricaProyecto
from .serializers import MetricaProyectoSerializer
from proyectos.models import Proyecto
from django.shortcuts import get_object_or_404

class MetricaProyectoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para consultar las métricas de los proyectos e incrementar contadores (vistas, likes, compartidos).
    """
    queryset = MetricaProyecto.objects.all().select_related('proyecto')
    serializer_class = MetricaProyectoSerializer

    def list(self, request, *args, **kwargs):
        # Asegurar que cada Proyecto del sistema tenga su registro de métrica creado
        for proyecto in Proyecto.objects.all():
            MetricaProyecto.objects.get_or_create(proyecto=proyecto)
        return super().list(request, *args, **kwargs)

    @action(detail=True, methods=['post'], url_path='view')
    def inc_view(self, request, pk=None):
        metrica = self.get_object()
        metrica.vistas_totales += 1
        metrica.save()
        return Response(self.get_serializer(metrica).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='like')
    def inc_like(self, request, pk=None):
        metrica = self.get_object()
        metrica.likes_totales += 1
        metrica.save()
        return Response(self.get_serializer(metrica).data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='share')
    def inc_share(self, request, pk=None):
        metrica = self.get_object()
        metrica.compartidos_totales += 1
        metrica.save()
        return Response(self.get_serializer(metrica).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path=r'por-proyecto/(?P<proyecto_id>\d+)/view')
    def view_por_proyecto(self, request, proyecto_id=None):
        proyecto = get_object_or_404(Proyecto, pk=proyecto_id)
        metrica, _ = MetricaProyecto.objects.get_or_create(proyecto=proyecto)
        metrica.vistas_totales += 1
        metrica.save()
        return Response(self.get_serializer(metrica).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path=r'por-proyecto/(?P<proyecto_id>\d+)/like')
    def like_por_proyecto(self, request, proyecto_id=None):
        proyecto = get_object_or_404(Proyecto, pk=proyecto_id)
        metrica, _ = MetricaProyecto.objects.get_or_create(proyecto=proyecto)
        metrica.likes_totales += 1
        metrica.save()
        return Response(self.get_serializer(metrica).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path=r'por-proyecto/(?P<proyecto_id>\d+)/unlike')
    def unlike_por_proyecto(self, request, proyecto_id=None):
        proyecto = get_object_or_404(Proyecto, pk=proyecto_id)
        metrica, _ = MetricaProyecto.objects.get_or_create(proyecto=proyecto)
        if metrica.likes_totales > 0:
            metrica.likes_totales -= 1
            metrica.save()
        return Response(self.get_serializer(metrica).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path=r'por-proyecto/(?P<proyecto_id>\d+)/share')
    def share_por_proyecto(self, request, proyecto_id=None):
        proyecto = get_object_or_404(Proyecto, pk=proyecto_id)
        metrica, _ = MetricaProyecto.objects.get_or_create(proyecto=proyecto)
        metrica.compartidos_totales += 1
        metrica.save()
        return Response(self.get_serializer(metrica).data, status=status.HTTP_200_OK)
