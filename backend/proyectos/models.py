from django.db import models
from usuarios.models import Usuario
from carreras.models import Carrera

class Categoria(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=60, unique=True)
    descripcion = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Tecnologia(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=60, unique=True)

    class Meta:
        verbose_name = "Tecnología"
        verbose_name_plural = "Tecnologías"
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class ProyectoODS(models.Model):
    """
    Modelo intermedio para relacionar muchos ODS con un proyecto.
    """
    proyecto = models.ForeignKey('Proyecto', on_delete=models.CASCADE, related_name='ods_relacionados')
    ods_id = models.PositiveSmallIntegerField()  # 1-17
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('proyecto', 'ods_id')
        verbose_name = "ODS del Proyecto"
        verbose_name_plural = "ODS del Proyecto"

    def __str__(self):
        return f"{self.proyecto.titulo} - ODS {self.ods_id}"


class Proyecto(models.Model):
    ESTADOS = (
        ('BORRADOR', 'Borrador'),
        ('PUBLICADO', 'Publicado'),
    )

    titulo = models.CharField(max_length=150)
    descripcion = models.TextField()
    autor_nombre = models.CharField(max_length=150)

    carrera = models.ForeignKey(
        Carrera,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='proyectos',
        verbose_name="Carrera"
    )
    ciclo = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        choices=[(i, i) for i in range(1, 13)],
        verbose_name="Ciclo"
    )

    estado_publicacion = models.CharField(max_length=20, choices=ESTADOS, default='BORRADOR')
    creado_por = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='proyectos')
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Proyecto"
        verbose_name_plural = "Proyectos"
        ordering = ['-created_at']

    def __str__(self):
        return self.titulo


class Proyecto3D(Proyecto):
    archivo_fbx = models.FileField(upload_to='modelos_3d/fbx/')
    imagen_miniatura = models.ImageField(upload_to='portadas/3d/', null=True, blank=True)
    configuracion_interactiva = models.JSONField(default=dict, blank=True)

    class Meta:
        verbose_name = "Proyecto 3D"
        verbose_name_plural = "Proyectos 3D"


class ProyectoSoftware(Proyecto):
    archivo_video = models.FileField(upload_to='videos_software/', null=True, blank=True)
    url_repositorio = models.URLField(max_length=200, blank=True, null=True)
    url_demo_live = models.URLField(max_length=200, blank=True, null=True)
    imagen_portada = models.ImageField(upload_to='portadas/software/', null=True, blank=True)
    tecnologias = models.ManyToManyField(Tecnologia, related_name='proyectos_software', blank=True)

    class Meta:
        verbose_name = "Proyecto de Software"
        verbose_name_plural = "Proyectos de Software"