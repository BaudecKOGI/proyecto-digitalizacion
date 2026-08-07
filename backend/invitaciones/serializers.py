from rest_framework import serializers
from proyectos.models import Proyecto3D, ProyectoSoftware
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
    class Meta:
        model = Proyecto3D
        fields = ['titulo', 'descripcion', 'carrera', 'ciclo', 'categoria', 'ods', 'archivo_fbx', 'imagen_miniatura']


class CompletarProyectoSoftwareSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProyectoSoftware
        fields = ['titulo', 'descripcion', 'carrera', 'ciclo', 'categoria', 'ods',
                  'archivo_video', 'url_repositorio', 'url_demo_live', 'imagen_portada', 'tecnologias']