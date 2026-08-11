# backend/usuarios/management/commands/create_superuser_admin.py

from django.core.management.base import BaseCommand
from usuarios.models import Usuario

class Command(BaseCommand):
    help = 'Crea un superusuario de Django con email como identificador'

    def handle(self, *args, **options):
        email = 'bryan.uceda@tecsup.edu.pe'
        password = '123456'
        nombre = 'Alessandro'

        # Eliminar si existe (para asegurar que se cree limpio)
        Usuario.objects.filter(email=email).delete()

        # Crear nuevo superusuario
        user = Usuario.objects.create_superuser(
            email=email,
            password=password,
            nombre=nombre,
            rol='ADMIN'  # También le asignamos rol ADMIN para consistencia
        )

        self.stdout.write(self.style.SUCCESS(f'✅ Superusuario de Django creado: {email}'))