from rest_framework import serializers
from proyectos.models import Categoria, Tecnologia, Proyecto, Proyecto3D, ProyectoSoftware, ProyectoODS
from usuarios.models import Usuario
from carreras.models import Carrera
from django.utils.text import slugify
import json

class CategoriaSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(required=False, allow_blank=True)
    proyectos_count = serializers.IntegerField(source='proyecto_set.count', read_only=True)

    class Meta:
        model = Categoria
        fields = ['id', 'nombre', 'slug', 'descripcion', 'proyectos_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'proyectos_count', 'created_at', 'updated_at']

    def validate_nombre(self, value):
        nombre = value.strip()
        if self.instance and self.instance.nombre.lower() == nombre.lower():
            return nombre
        if Categoria.objects.filter(nombre__iexact=nombre).exists():
            raise serializers.ValidationError("Ya existe una categoría con este nombre.")
        return nombre

    def create(self, validated_data):
        if not validated_data.get('slug'):
            base_slug = slugify(validated_data['nombre']) or "categoria"
            slug = base_slug
            counter = 1
            while Categoria.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            validated_data['slug'] = slug
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'nombre' in validated_data and not validated_data.get('slug'):
            base_slug = slugify(validated_data['nombre']) or "categoria"
            slug = base_slug
            counter = 1
            while Categoria.objects.filter(slug=slug).exclude(id=instance.id).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            validated_data['slug'] = slug
        return super().update(instance, validated_data)


class TecnologiaSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(required=False, allow_blank=True)

    class Meta:
        model = Tecnologia
        fields = ['id', 'nombre', 'slug']
        read_only_fields = ['id']

    def validate_nombre(self, value):
        nombre = value.strip()
        if self.instance and self.instance.nombre.lower() == nombre.lower():
            return nombre
        if Tecnologia.objects.filter(nombre__iexact=nombre).exists():
            raise serializers.ValidationError("Ya existe una tecnología con este nombre.")
        return nombre

    def create(self, validated_data):
        if not validated_data.get('slug'):
            base_slug = slugify(validated_data['nombre']) or "tecnologia"
            slug = base_slug
            counter = 1
            while Tecnologia.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            validated_data['slug'] = slug
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'nombre' in validated_data and not validated_data.get('slug'):
            base_slug = slugify(validated_data['nombre']) or "tecnologia"
            slug = base_slug
            counter = 1
            while Tecnologia.objects.filter(slug=slug).exclude(id=instance.id).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            validated_data['slug'] = slug
        return super().update(instance, validated_data)


class ProyectoSerializer(serializers.ModelSerializer):
    creado_por_nombre = serializers.CharField(source='creado_por.nombre', read_only=True)
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    vistas_totales = serializers.SerializerMethodField()
    likes_totales = serializers.SerializerMethodField()
    compartidos_totales = serializers.SerializerMethodField()
    creado_por = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.all(),
        required=False,
        allow_null=True
    )
    categoria = serializers.PrimaryKeyRelatedField(
        queryset=Categoria.objects.all(),
        required=False,
        allow_null=True
    )

    # Campos para carrera y ciclo
    carrera_nombre = serializers.CharField(source='carrera.nombre', read_only=True)
    ciclo_romano = serializers.SerializerMethodField()
    carrera = serializers.PrimaryKeyRelatedField(
        queryset=Carrera.objects.all(),
        required=False,
        allow_null=True
    )
    ciclo = serializers.IntegerField(required=False, allow_null=True)

    # Campo para ODS (recibe string JSON o lista)
    ods_ids = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        write_only=True,
        help_text="Lista de IDs de ODS en formato JSON string o lista"
    )
    ods_detalle = serializers.SerializerMethodField()

    class Meta:
        model = Proyecto
        fields = [
            'id', 'titulo', 'descripcion', 'autor_nombre',
            'carrera', 'carrera_nombre', 'ciclo', 'ciclo_romano',
            'estado_publicacion', 'creado_por', 'creado_por_nombre',
            'categoria', 'categoria_nombre',
            'vistas_totales', 'likes_totales', 'compartidos_totales',
            'created_at', 'updated_at',
            'ods_ids', 'ods_detalle'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'carrera_nombre', 'ciclo_romano', 'ods_detalle']

    def get_vistas_totales(self, obj):
        return getattr(obj, 'metricas', None).vistas_totales if hasattr(obj, 'metricas') and obj.metricas else 0

    def get_likes_totales(self, obj):
        return getattr(obj, 'metricas', None).likes_totales if hasattr(obj, 'metricas') and obj.metricas else 0

    def get_compartidos_totales(self, obj):
        return getattr(obj, 'metricas', None).compartidos_totales if hasattr(obj, 'metricas') and obj.metricas else 0

    def get_ciclo_romano(self, obj):
        if obj.ciclo is None:
            return None
        romanos = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']
        return romanos[obj.ciclo - 1] if 1 <= obj.ciclo <= 12 else str(obj.ciclo)

    def get_ods_detalle(self, obj):
        ods_rel = obj.ods_relacionados.all().order_by('ods_id')
        ods_choices = dict(Proyecto.ODS_CHOICES)
        return [{'id': r.ods_id, 'label': ods_choices.get(r.ods_id, f'ODS {r.ods_id}')} for r in ods_rel]

    def _parse_ods_ids(self, value):
        """Convierte el valor de ods_ids a lista de enteros."""
        if value is None or value == '':
            return []
        if isinstance(value, list):
            return [int(x) for x in value if x is not None]
        if isinstance(value, str):
            try:
                parsed = json.loads(value)
                if isinstance(parsed, list):
                    return [int(x) for x in parsed if x is not None]
                else:
                    return []
            except json.JSONDecodeError:
                parts = value.split(',')
                return [int(x.strip()) for x in parts if x.strip().isdigit()]
        return []

    def create(self, validated_data):
        ods_ids_raw = validated_data.pop('ods_ids', None)
        ods_ids = self._parse_ods_ids(ods_ids_raw)
        
        if not validated_data.get('creado_por'):
            validated_data['creado_por'] = Usuario.objects.first()
        if not validated_data.get('categoria'):
            validated_data['categoria'] = Categoria.objects.first()
        
        proyecto = super().create(validated_data)
        
        for ods_id in ods_ids:
            ProyectoODS.objects.create(proyecto=proyecto, ods_id=ods_id)
        
        return proyecto

    def update(self, instance, validated_data):
        ods_ids_raw = validated_data.pop('ods_ids', None)
        
        # Asignar campos simples (excluyendo los que son relaciones many-to-many o virtuales)
        for attr, value in validated_data.items():
            # Evitar asignar campos many-to-many o virtuales (esto se maneja en los hijos)
            if attr not in ['tecnologias']:  # 'tecnologias' se maneja en ProyectoSoftwareSerializer
                setattr(instance, attr, value)
        instance.save()
        
        if ods_ids_raw is not None:
            ods_ids = self._parse_ods_ids(ods_ids_raw)
            instance.ods_relacionados.all().delete()
            for ods_id in ods_ids:
                ProyectoODS.objects.create(proyecto=instance, ods_id=ods_id)
        
        return instance


class Proyecto3DSerializer(ProyectoSerializer):
    class Meta(ProyectoSerializer.Meta):
        model = Proyecto3D
        fields = ProyectoSerializer.Meta.fields + [
            'archivo_fbx', 'imagen_miniatura', 'configuracion_interactiva'
        ]


class ProyectoSoftwareSerializer(ProyectoSerializer):
    tecnologias = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Tecnologia.objects.all(),
        required=False
    )
    tecnologias_detalle = TecnologiaSerializer(source='tecnologias', many=True, read_only=True)

    class Meta(ProyectoSerializer.Meta):
        model = ProyectoSoftware
        fields = ProyectoSerializer.Meta.fields + [
            'archivo_video', 'url_repositorio', 'url_demo_live',
            'imagen_portada', 'tecnologias', 'tecnologias_detalle'
        ]

    def update(self, instance, validated_data):
        # Extraer tecnologias del validated_data
        tecnologias_data = validated_data.pop('tecnologias', None)
        
        # Actualizar el resto de campos (incluyendo ods_ids) usando el método padre
        instance = super().update(instance, validated_data)
        
        # Manejar tecnologias (many-to-many)
        if tecnologias_data is not None:
            # Si es una lista de objetos, extraer los IDs
            if isinstance(tecnologias_data, list):
                # Si los elementos son objetos, extraer sus IDs
                ids = []
                for item in tecnologias_data:
                    if hasattr(item, 'id'):
                        ids.append(item.id)
                    else:
                        ids.append(item)
                instance.tecnologias.set(ids)
            else:
                # Si es un solo objeto o ID, convertirlo a lista
                if hasattr(tecnologias_data, 'id'):
                    instance.tecnologias.set([tecnologias_data.id])
                else:
                    instance.tecnologias.set([tecnologias_data])
        
        return instance