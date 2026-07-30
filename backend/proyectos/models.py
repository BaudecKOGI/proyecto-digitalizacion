from django.db import models
from usuarios.models import Usuario

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


class Proyecto(models.Model):
    ESTADOS = (
        ('BORRADOR', 'Borrador'),
        ('PUBLICADO', 'Publicado'),
        ('ARCHIVADO', 'Archivado'),
    )
    ODS_CHOICES = (
        (1, 'ODS 1: Fin de la Pobreza'),
        (2, 'ODS 2: Hambre Cero'),
        (3, 'ODS 3: Salud y Bienestar'),
        (4, 'ODS 4: Educación de Calidad'),
        (5, 'ODS 5: Igualdad de Género'),
        (6, 'ODS 6: Agua Limpia y Saneamiento'),
        (7, 'ODS 7: Energía Asequible y No Contaminante'),
        (8, 'ODS 8: Trabajo Decente y Crecimiento Económico'),
        (9, 'ODS 9: Industria, Innovación e Infraestructura'),
        (10, 'ODS 10: Reducción de las Desigualdades'),
        (11, 'ODS 11: Ciudades y Comunidades Sostenibles'),
        (12, 'ODS 12: Producción y Consumo Responsables'),
        (13, 'ODS 13: Acción por el Clima'),
        (14, 'ODS 14: Vida Submarina'),
        (15, 'ODS 15: Vida de Ecosistemas Terrestres'),
        (16, 'ODS 16: Paz, Justicia e Instituciones Sólidas'),
        (17, 'ODS 17: Alianzas para Lograr los Objetivos'),
    )

    titulo = models.CharField(max_length=150)
    descripcion = models.TextField()
    autor_nombre = models.CharField(max_length=150)
    carrera = models.CharField(max_length=100)
    ciclo = models.CharField(max_length=20)
    estado_publicacion = models.CharField(max_length=20, choices=ESTADOS, default='BORRADOR')
    ods = models.PositiveSmallIntegerField(choices=ODS_CHOICES, null=True, blank=True, verbose_name="ODS Principal")
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