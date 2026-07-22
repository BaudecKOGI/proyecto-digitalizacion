from django.db import models
from proyectos.models import Proyecto

class MetricaProyecto(models.Model):
    proyecto = models.OneToOneField(Proyecto, on_delete=models.CASCADE, related_name='metricas')
    vistas_totales = models.PositiveIntegerField(default=0)
    likes_totales = models.PositiveIntegerField(default=0)
    compartidos_totales = models.PositiveIntegerField(default=0)
    ultima_visita = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Métricas de: {self.proyecto.titulo}"