from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    ROLES = (
        ('ADMIN', 'Administrador General'),
        ('PROF', 'Profesor / Encargado'),
    )
    
    # Eliminamos el campo username por defecto para usar solo el email
    username = None 
    nombre = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    rol = models.CharField(max_length=10, choices=ROLES, default='PROF')
    updated_at = models.DateTimeField(auto_now=True)
    
    # is_active, last_login y created_at (date_joined) ya vienen incluidos en AbstractUser

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre']

    def __str__(self):
        return f"{self.nombre} ({self.rol})"