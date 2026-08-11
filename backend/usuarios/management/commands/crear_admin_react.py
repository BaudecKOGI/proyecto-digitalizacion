# backend/usuarios/management/commands/crear_admin_react.py

from django.core.management.base import BaseCommand
from usuarios.models import Usuario

class Command(BaseCommand):
    help = 'Crea la cuenta del Administrador General de React automáticamente'

    def handle(self, *args, **options):
        # Datos del Administrador de React
        nombre = 'Admin'
        email = 'fablab@continental.edu.pe'
        password = '12345678'

        # Usamos update_or_create para que siempre exista
        usuario, created = Usuario.objects.update_or_create(
            email=email,
            defaults={
                'nombre': nombre,
                'rol': Usuario.ROL_ADMIN,
                'is_staff': False,
                'is_superuser': False,
                'is_active': True,
            }
        )

        # Si se creó, asignar password (update_or_create no actualiza password por defecto)
        if created:
            usuario.set_password(password)
            usuario.save()
            self.stdout.write(
                self.style.SUCCESS('✅ Administrador de React creado correctamente.')
            )
        else:
            # Si ya existía, actualizar password por si cambió
            usuario.set_password(password)
            usuario.save()
            self.stdout.write(
                self.style.WARNING('🔄 Administrador de React actualizado (contraseña restablecida).')
            )

        self.stdout.write(f'   Correo: {email}')
        self.stdout.write('   Rol: ADMIN (Sin permisos técnicos de servidor)\n')