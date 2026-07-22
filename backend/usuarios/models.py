from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager

# 1. Creamos el Manager personalizado para que entienda el Email en lugar del Username
class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El Email es obligatorio')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('rol', 'ADMIN')

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser debe tener is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

# 2. Tu modelo de Usuario intacto, pero ahora conectado al Manager
class Usuario(AbstractUser):
    ROLES = (
        ('ADMIN', 'Administrador General'),
        ('PROF', 'Profesor / Encargado'),
    )
    
    username = None 
    nombre = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    rol = models.CharField(max_length=10, choices=ROLES, default='PROF')
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre']

    # Aquí le decimos a Django que use nuestro Manager arreglado
    objects = UsuarioManager()

    def __str__(self):
        return f"{self.nombre} ({self.rol})"