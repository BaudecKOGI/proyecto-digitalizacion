from rest_framework import serializers
from usuarios.models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=False,
        style={'input_type': 'password'},
        help_text='Contraseña del usuario (opcional en edición)'
    )
    avatar_url = serializers.SerializerMethodField()
    proyectos_3d_count = serializers.SerializerMethodField()
    proyectos_software_count = serializers.SerializerMethodField()
    
    # NUEVOS: listas de proyectos con título y fecha
    proyectos_3d_list = serializers.SerializerMethodField()
    proyectos_software_list = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = [
            'id',
            'nombre',
            'email',
            'rol',
            'avatar',
            'avatar_url',
            'proyectos_3d_count',
            'proyectos_software_count',
            'proyectos_3d_list',        # nuevo
            'proyectos_software_list',  # nuevo
            'is_active',
            'password',
            'updated_at',
            'date_joined'
        ]
        read_only_fields = [
            'id',
            'avatar_url',
            'proyectos_3d_count',
            'proyectos_software_count',
            'proyectos_3d_list',
            'proyectos_software_list',
            'updated_at',
            'date_joined'
        ]

    def get_avatar_url(self, obj):
        if obj.avatar and hasattr(obj.avatar, 'url'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None

    def get_proyectos_3d_count(self, obj):
        from proyectos.models import Proyecto3D
        return Proyecto3D.objects.filter(creado_por=obj).count()

    def get_proyectos_software_count(self, obj):
        from proyectos.models import ProyectoSoftware
        return ProyectoSoftware.objects.filter(creado_por=obj).count()

    # NUEVOS: métodos para obtener listas de proyectos
    def get_proyectos_3d_list(self, obj):
        from proyectos.models import Proyecto3D
        proyectos = Proyecto3D.objects.filter(creado_por=obj).order_by('-created_at')
        return [{"titulo": p.titulo, "fecha": p.created_at.isoformat()} for p in proyectos]

    def get_proyectos_software_list(self, obj):
        from proyectos.models import ProyectoSoftware
        proyectos = ProyectoSoftware.objects.filter(creado_por=obj).order_by('-created_at')
        return [{"titulo": p.titulo, "fecha": p.created_at.isoformat()} for p in proyectos]

    def validate_email(self, value):
        email = value.lower().strip()
        # En caso de actualización, ignorar el email del propio usuario
        if self.instance and self.instance.email == email:
            return email
        if Usuario.objects.filter(email=email).exists():
            raise serializers.ValidationError("Ya existe una cuenta registrada con este correo electrónico.")
        return email

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        if not password:
            raise serializers.ValidationError({"password": "La contraseña es obligatoria para crear una cuenta."})
        return Usuario.objects.create_user(password=password, **validated_data)

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance