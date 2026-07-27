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

    class Meta:
        model = Usuario
        fields = [
            'id',
            'nombre',
            'email',
            'rol',
            'avatar',
            'avatar_url',
            'is_active',
            'password',
            'updated_at',
            'date_joined'
        ]
        read_only_fields = ['id', 'avatar_url', 'updated_at', 'date_joined']

    def get_avatar_url(self, obj):
        if obj.avatar and hasattr(obj.avatar, 'url'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return None

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
