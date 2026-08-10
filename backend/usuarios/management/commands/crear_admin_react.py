from django.core.management.base import BaseCommand
from usuarios.models import Usuario

class Command(BaseCommand):
    help = 'Crea la cuenta del Administrador General de React automáticamente'

    def handle(self, *args, **options):
        # 1. ¿Existe algún ADMIN?
        if Usuario.objects.filter(rol=Usuario.ROL_ADMIN).exists():
            self.stdout.write(
                self.style.WARNING('Ya existe un Administrador General registrado en el sistema.')
            )
            return

        # 2. Datos del Administrador de React
        nombre = 'Admin'
        email = 'fablab@continental.edu.pe'
        password = '12345678'

        # 3. Crear el usuario Administrador de React independiente
        Usuario.objects.create_user(
            email=email,
            password=password,
            nombre=nombre,
            rol=Usuario.ROL_ADMIN,
            is_staff=False,
            is_superuser=False,
            is_active=True,
        )

        self.stdout.write(
            self.style.SUCCESS('✅ Administrador de React creado correctamente.')
        )
        self.stdout.write(f'   Correo: {email}')
        self.stdout.write('   Rol: ADMIN (Sin permisos técnicos de servidor - 100% independiente)\n')