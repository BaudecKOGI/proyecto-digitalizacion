from django.core.management.base import BaseCommand
from usuarios.models import Usuario


class Command(BaseCommand):
    help = 'Crea un superusuario con email como identificador'

    def handle(self, *args, **options):
        email = 'bryan.uceda@tecsup.esu.pe'
        password = '123456'
        nombre = 'Alessandro'

        # Eliminar si existe
        Usuario.objects.filter(email=email).delete()

        # Crear nuevo
        user = Usuario.objects.create_superuser(
            email=email,
            password=password,
            nombre=nombre,
            rol='ADMIN'
        )

        self.stdout.write(self.style.SUCCESS(f'✅ Superusuario creado: {email}'))

