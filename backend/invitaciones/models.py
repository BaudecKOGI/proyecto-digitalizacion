import secrets
from datetime import timedelta

from django.db import models
from django.utils import timezone

from usuarios.models import Usuario   # mismo import que ya usas en proyectos/models.py
from proyectos.models import Proyecto


def generar_token():
    return secrets.token_urlsafe(24)


def calcular_expiracion():
    return timezone.now() + timedelta(hours=24)


class InvitacionProyecto(models.Model):
    TIPOS = (
        ('3D', 'Proyecto 3D'),
        ('SOFTWARE', 'Proyecto de Software'),
    )

    tipo = models.CharField(max_length=10, choices=TIPOS)
    autor_nombre = models.CharField(max_length=150)
    token = models.CharField(max_length=64, unique=True, default=generar_token, editable=False)
    creado_por = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='invitaciones_creadas')
    expira_en = models.DateTimeField(default=calcular_expiracion)
    usado = models.BooleanField(default=False)

    # Se llena recién cuando el alumno completa el formulario, no antes.
    proyecto = models.OneToOneField(
        Proyecto, on_delete=models.SET_NULL, null=True, blank=True, related_name='invitacion'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Invitación de proyecto"
        verbose_name_plural = "Invitaciones de proyecto"
        ordering = ['-created_at']

    def esta_vigente(self):
        return (not self.usado) and timezone.now() < self.expira_en

    def __str__(self):
        estado = 'usada' if self.usado else ('activa' if self.esta_vigente() else 'vencida')
        return f"Invitación #{self.id} · {self.autor_nombre} · {estado}"