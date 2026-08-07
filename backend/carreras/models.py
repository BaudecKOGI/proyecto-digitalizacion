from django.db import models

class Carrera(models.Model):
    nombre = models.CharField(max_length=100, unique=True)
    codigo = models.CharField(max_length=20, blank=True, null=True)
    duracion_ciclos = models.PositiveSmallIntegerField(
        default=12,
        choices=[(i, f'{i}') for i in range(1, 13)]
    )
    activo = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nombre} ({self.duracion_ciclos} ciclos)"