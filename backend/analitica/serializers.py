from rest_framework import serializers
from django.utils.text import slugify
from .models import MetricaProyecto
from proyectos.models import Proyecto

class MetricaProyectoSerializer(serializers.ModelSerializer):
    proyecto_titulo = serializers.SerializerMethodField()
    proyecto_slug = serializers.SerializerMethodField()
    proyecto_categoria = serializers.SerializerMethodField()
    proyecto_ods = serializers.SerializerMethodField()
    proyecto_tipo = serializers.SerializerMethodField()
    proyecto_miniatura = serializers.SerializerMethodField()
    tasa_engagement = serializers.SerializerMethodField()

    class Meta:
        model = MetricaProyecto
        fields = [
            'id',
            'proyecto',
            'proyecto_titulo',
            'proyecto_slug',
            'proyecto_categoria',
            'proyecto_ods',
            'proyecto_tipo',
            'proyecto_miniatura',
            'vistas_totales',
            'likes_totales',
            'compartidos_totales',
            'tasa_engagement',
            'ultima_visita',
        ]
        read_only_fields = [
            'proyecto_titulo',
            'proyecto_slug',
            'proyecto_categoria',
            'proyecto_ods',
            'proyecto_tipo',
            'proyecto_miniatura',
            'tasa_engagement',
            'ultima_visita',
        ]

    def get_proyecto_titulo(self, obj):
        return obj.proyecto.titulo if obj.proyecto else ""

    def get_proyecto_slug(self, obj):
        if obj.proyecto and obj.proyecto.titulo:
            return slugify(obj.proyecto.titulo)
        return ""

    def get_proyecto_categoria(self, obj):
        if obj.proyecto and getattr(obj.proyecto, 'categoria', None):
            return obj.proyecto.categoria.nombre
        return "General"

    def get_proyecto_ods(self, obj):
        if obj.proyecto and getattr(obj.proyecto, 'ods', None):
            ods_num = obj.proyecto.ods
            return f"ODS {ods_num}"
        return "-"

    def get_proyecto_tipo(self, obj):
        if obj.proyecto and hasattr(obj.proyecto, 'proyecto3d'):
            return "Modelo 3D"
        return "Digital"

    def get_proyecto_miniatura(self, obj):
        if not obj.proyecto: return None
        try:
            url = None
            if hasattr(obj.proyecto, 'proyecto3d') and obj.proyecto.proyecto3d.imagen_miniatura:
                url = obj.proyecto.proyecto3d.imagen_miniatura.url
            elif hasattr(obj.proyecto, 'proyectosoftware') and obj.proyecto.proyectosoftware.imagen_portada:
                url = obj.proyecto.proyectosoftware.imagen_portada.url
            
            if url:
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(url)
                return url
        except Exception:
            pass
        return None

    def get_tasa_engagement(self, obj):
        if obj.vistas_totales and obj.vistas_totales > 0:
            rate = ((obj.likes_totales + obj.compartidos_totales) / obj.vistas_totales) * 100
            return round(rate, 1)
        return 0.0
