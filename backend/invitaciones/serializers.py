from rest_framework import serializers
from proyectos.models import Proyecto3D, ProyectoSoftware, ProyectoODS
from .models import InvitacionProyecto


class InvitacionCrearSerializer(serializers.ModelSerializer):
    """La usa el admin para generar una invitación nueva."""
    class Meta:
        model = InvitacionProyecto
        fields = ['id', 'tipo', 'autor_nombre', 'token', 'expira_en', 'created_at']
        read_only_fields = ['id', 'token', 'expira_en', 'created_at']


class InvitacionEstadoSerializer(serializers.ModelSerializer):
    """Lo que ve el alumno al abrir el link, antes de llenar nada."""
    vigente = serializers.SerializerMethodField()

    class Meta:
        model = InvitacionProyecto
        fields = ['tipo', 'autor_nombre', 'expira_en', 'usado', 'vigente']

    def get_vigente(self, obj):
        return obj.esta_vigente()


class CompletarProyecto3DSerializer(serializers.ModelSerializer):
    """Serializador para que el alumno complete un proyecto 3D."""
    ods_ids = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        write_only=True,
        help_text="Lista de IDs de ODS en formato JSON string o lista"
    )

    class Meta:
        model = Proyecto3D
        fields = [
            'titulo', 'descripcion', 'carrera', 'ciclo', 'categoria',
            'ods_ids', 'archivo_fbx', 'imagen_miniatura'
        ]

    def create(self, validated_data):
        # Extraer ods_ids y removerlo de validated_data
        ods_ids_raw = validated_data.pop('ods_ids', None)
        
        # Crear el proyecto
        proyecto = super().create(validated_data)
        
        # Procesar ODS si hay
        if ods_ids_raw:
            # Parsear el string JSON a lista
            import json
            try:
                ods_ids = json.loads(ods_ids_raw)
                if isinstance(ods_ids, list):
                    for ods_id in ods_ids:
                        ProyectoODS.objects.create(proyecto=proyecto, ods_id=ods_id)
            except (json.JSONDecodeError, TypeError):
                pass  # Si no es válido, no hacemos nada
        
        return proyecto


class CompletarProyectoSoftwareSerializer(serializers.ModelSerializer):
    """Serializador para que el alumno complete un proyecto de software."""
    ods_ids = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
        write_only=True,
        help_text="Lista de IDs de ODS en formato JSON string o lista"
    )

    class Meta:
        model = ProyectoSoftware
        fields = [
            'titulo', 'descripcion', 'carrera', 'ciclo', 'categoria',
            'ods_ids', 'archivo_video', 'url_repositorio', 'url_demo_live',
            'imagen_portada', 'tecnologias'
        ]

    def create(self, validated_data):
        # Extraer ods_ids y removerlo de validated_data
        ods_ids_raw = validated_data.pop('ods_ids', None)
        
        # Extraer tecnologias
        tecnologias_data = validated_data.pop('tecnologias', [])
        
        # Crear el proyecto
        proyecto = super().create(validated_data)
        
        # Procesar ODS si hay
        if ods_ids_raw:
            import json
            try:
                ods_ids = json.loads(ods_ids_raw)
                if isinstance(ods_ids, list):
                    for ods_id in ods_ids:
                        ProyectoODS.objects.create(proyecto=proyecto, ods_id=ods_id)
            except (json.JSONDecodeError, TypeError):
                pass
        
        # Procesar tecnologias
        if tecnologias_data:
            # Si es una lista de objetos o IDs
            ids = []
            for item in tecnologias_data:
                if hasattr(item, 'id'):
                    ids.append(item.id)
                else:
                    ids.append(item)
            proyecto.tecnologias.set(ids)
        
        return proyecto