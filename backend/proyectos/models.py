from django.db import models
from usuarios.models import Usuario

class Categoria(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=60, unique=True)
    descripcion = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre

class Proyecto(models.Model):
    ESTADOS = (
        ('BORRADOR', 'Borrador'),
        ('PUBLICADO', 'Publicado'),
        ('ARCHIVADO', 'Archivado'),
    )
    titulo = models.CharField(max_length=150)
    descripcion = models.TextField()
    autor_nombre = models.CharField(max_length=150)
    carrera = models.CharField(max_length=100)
    ciclo = models.CharField(max_length=20)
    estado_publicacion = models.CharField(max_length=20, choices=ESTADOS, default='BORRADOR')
    creado_por = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='proyectos')
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.titulo

class Proyecto3D(Proyecto):
    archivo_fbx = models.FileField(upload_to='modelos_3d/fbx/')
    imagen_miniatura = models.ImageField(upload_to='portadas/3d/', null=True, blank=True)
    configuracion_interactiva = models.JSONField(default=dict, blank=True)
