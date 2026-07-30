from rest_framework import serializers
from proyectos.models import Categoria, Tecnologia, Proyecto, Proyecto3D, ProyectoSoftware
from usuarios.models import Usuario
from usuarios.serializers import UsuarioSerializer
from django.utils.text import slugify

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

    class Meta:
        model = Proyecto
        fields = [
            'id', 'titulo', 'descripcion', 'autor_nombre', 'carrera', 'ciclo',
            'estado_publicacion', 'ods', 'creado_por', 'creado_por_nombre', 'categoria',
            'categoria_nombre', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        if not validated_data.get('creado_por'):
            validated_data['creado_por'] = Usuario.objects.first()
        if not validated_data.get('categoria'):
            validated_data['categoria'] = Categoria.objects.first()
        return super().create(validated_data)


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
