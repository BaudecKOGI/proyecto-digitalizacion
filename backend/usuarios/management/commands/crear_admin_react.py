import getpass
import re
from django.core.management.base import BaseCommand
from usuarios.models import Usuario

class Command(BaseCommand):
    help = 'Crea la cuenta del Administrador General de React (rol=ADMIN, independiente del Superusuario de Django)'

    def handle(self, *args, **options):
        # 1. ¿Existe algún ADMIN?
        if Usuario.objects.filter(rol=Usuario.ROL_ADMIN).exists():
            self.stdout.write(
                self.style.WARNING('Ya existe un Administrador General registrado en el sistema.')
            )
            return

        self.stdout.write(
            self.style.MIGRATE_HEADING('Creación del Administrador de React')
        )

        # 2. Solicitar Nombre
        while True:
            nombre = input('Nombre: ').strip()
            if nombre:
                break
            self.stdout.write(self.style.ERROR('El nombre no puede estar vacío.'))

        # 3. Solicitar Correo
        email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        while True:
            email = input('Correo: ').strip().lower()
            if not email:
                self.stdout.write(self.style.ERROR('El correo no puede estar vacío.'))
                continue
            if not re.match(email_regex, email):
                self.stdout.write(self.style.ERROR('Por favor, ingresa un formato de correo válido.'))
                continue
            if Usuario.objects.filter(email=email).exists():
                self.stdout.write(self.style.ERROR('Este correo ya está registrado en la base de datos.'))
                continue
            break

        # 4. Solicitar y Confirmar Contraseña
        while True:
            password = getpass.getpass('Contraseña: ')
            if len(password) < 6:
                self.stdout.write(self.style.ERROR('La contraseña debe tener al menos 6 caracteres.'))
                continue
            password_confirm = getpass.getpass('Confirmar contraseña: ')
            if password != password_confirm:
                self.stdout.write(self.style.ERROR('Las contraseñas no coinciden. Intenta nuevamente.'))
                continue
            break

        # 5. Crear el usuario Administrador de React independiente
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
            self.style.SUCCESS('\nAdministrador de React creado correctamente.')
        )
        self.stdout.write(f'   Correo: {email}')
        self.stdout.write('   Rol: ADMIN (Sin permisos técnicos de servidor - 100% independiente)\n')
