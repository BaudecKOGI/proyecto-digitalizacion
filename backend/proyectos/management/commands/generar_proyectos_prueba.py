# backend/proyectos/management/commands/generar_proyectos_prueba.py

import random
import os
from django.core.management.base import BaseCommand
from django.core.files import File
from django.utils.text import slugify
from django.conf import settings
from faker import Faker

from proyectos.models import (
    Categoria, Tecnologia, Proyecto3D, ProyectoSoftware, ProyectoODS
)
from carreras.models import Carrera
from usuarios.models import Usuario

fake = Faker('es_ES')

class Command(BaseCommand):
    help = 'Genera 200 proyectos de prueba (3D y Software) para pruebas de rendimiento'

    def add_arguments(self, parser):
        parser.add_argument(
            '--total',
            type=int,
            default=200,
            help='Número total de proyectos a crear (por defecto 200)',
        )
        parser.add_argument(
            '--proporcion-3d',
            type=float,
            default=0.5,
            help='Proporción de proyectos 3D (0.5 = 50%%)',
        )

    def handle(self, *args, **options):
        total = options['total']
        proporcion_3d = options['proporcion_3d']

        # 1. Verificar catálogos
        self.stdout.write('Verificando catálogos...')
        categorias = list(Categoria.objects.all())
        if not categorias:
            self.stdout.write(self.style.ERROR('No hay categorías. Crea al menos una categoría primero.'))
            return

        carreras = list(Carrera.objects.filter(activo=True))
        if not carreras:
            self.stdout.write(self.style.ERROR('No hay carreras activas. Crea al menos una carrera.'))
            return

        tecnologias = list(Tecnologia.objects.all())
        if not tecnologias:
            self.stdout.write(self.style.WARNING('No hay tecnologías. Se asignará sin tecnologías.'))

        # 2. Obtener o crear un editor
        editor = Usuario.objects.filter(rol=Usuario.ROL_EDITOR).first()
        if not editor:
            self.stdout.write('No hay editores. Creando uno de prueba...')
            editor = Usuario.objects.create_user(
                email='editor_prueba@ejemplo.com',
                password='123456',
                nombre='Editor de Prueba',
                rol=Usuario.ROL_EDITOR,
                is_active=True
            )
            self.stdout.write(f'Editor creado: {editor.email}')

        # 3. Rutas de archivos base (usando MEDIA_ROOT)
        media_root = settings.MEDIA_ROOT

        # Ajusta estas rutas según tu estructura real
        base_fbx_path = os.path.join(media_root, 'modelos_3d', 'fbx', 'BrazoJerarquico.fbx')
        base_image_path = os.path.join(media_root, 'portadas', '3d', 'Bebidas.jpg')
        base_video_path = os.path.join(media_root, 'videos_software', 'Lab01.mp4')

        # Verificar existencia y abrir archivos
        if not os.path.exists(base_fbx_path):
            self.stdout.write(self.style.WARNING(f'No se encuentra {base_fbx_path}. Los proyectos 3D no tendrán archivo FBX.'))
            fbx_file = None
        else:
            fbx_file = open(base_fbx_path, 'rb')

        if not os.path.exists(base_image_path):
            self.stdout.write(self.style.WARNING(f'No se encuentra {base_image_path}. Se usará imagen por defecto.'))
            image_file = None
        else:
            image_file = open(base_image_path, 'rb')

        if not os.path.exists(base_video_path):
            self.stdout.write(self.style.WARNING(f'No se encuentra {base_video_path}. Los proyectos software no tendrán video.'))
            video_file = None
        else:
            video_file = open(base_video_path, 'rb')

        # 4. Contar cuántos 3D y software
        num_3d = int(total * proporcion_3d)
        num_software = total - num_3d

        self.stdout.write(f'Generando {num_3d} proyectos 3D y {num_software} proyectos de software...')

        # 5. Función para ODS aleatorios
        def obtener_ods_aleatorios():
            return random.sample(range(1, 18), k=random.randint(0, 3))

        # 6. Crear proyectos 3D
        self.stdout.write('Creando proyectos 3D...')
        for i in range(num_3d):
            titulo = fake.sentence(nb_words=4)[:50]
            descripcion = fake.paragraph(nb_sentences=3)
            autor_nombre = fake.name()
            carrera = random.choice(carreras)
            categoria = random.choice(categorias)
            ods_ids = obtener_ods_aleatorios()

            proyecto = Proyecto3D(
                titulo=titulo,
                descripcion=descripcion,
                autor_nombre=autor_nombre,
                carrera=carrera,
                ciclo=random.randint(1, carrera.duracion_ciclos),
                estado_publicacion=random.choice(['PUBLICADO', 'BORRADOR']),
                creado_por=editor,
                categoria=categoria,
            )

            # Asignar archivos (se crean copias con nombres únicos)
            if fbx_file:
                fbx_name = f'modelos_3d/fbx/prueba_3d_{i}.fbx'
                proyecto.archivo_fbx.save(fbx_name, File(fbx_file), save=False)

            if image_file:
                img_name = f'portadas/3d/prueba_3d_{i}.jpg'
                proyecto.imagen_miniatura.save(img_name, File(image_file), save=False)

            proyecto.save()

            # Añadir ODS
            for ods_id in ods_ids:
                ProyectoODS.objects.create(proyecto=proyecto, ods_id=ods_id)

            if (i + 1) % 10 == 0:
                self.stdout.write(f'   {i+1} proyectos 3D creados...')

        # 7. Crear proyectos Software
        self.stdout.write('Creando proyectos de software...')
        for i in range(num_software):
            titulo = fake.sentence(nb_words=4)[:50]
            descripcion = fake.paragraph(nb_sentences=3)
            autor_nombre = fake.name()
            carrera = random.choice(carreras)
            categoria = random.choice(categorias)
            ods_ids = obtener_ods_aleatorios()

            # Tecnologías aleatorias
            techs = random.sample(tecnologias, k=random.randint(0, min(3, len(tecnologias)))) if tecnologias else []

            proyecto = ProyectoSoftware(
                titulo=titulo,
                descripcion=descripcion,
                autor_nombre=autor_nombre,
                carrera=carrera,
                ciclo=random.randint(1, carrera.duracion_ciclos),
                estado_publicacion=random.choice(['PUBLICADO', 'BORRADOR']),
                creado_por=editor,
                categoria=categoria,
                url_repositorio=f'https://github.com/{slugify(titulo)}' if random.random() > 0.3 else '',
                url_demo_live=f'https://{slugify(titulo)}.vercel.app' if random.random() > 0.5 else '',
            )

            if video_file:
                video_name = f'videos_software/prueba_sw_{i}.mp4'
                proyecto.archivo_video.save(video_name, File(video_file), save=False)

            if image_file:
                img_name = f'portadas/software/prueba_sw_{i}.jpg'
                proyecto.imagen_portada.save(img_name, File(image_file), save=False)

            proyecto.save()

            # Tecnologías
            if techs:
                proyecto.tecnologias.set(techs)

            # ODS
            for ods_id in ods_ids:
                ProyectoODS.objects.create(proyecto=proyecto, ods_id=ods_id)

            if (i + 1) % 10 == 0:
                self.stdout.write(f'   {i+1} proyectos software creados...')

        # 8. Cerrar archivos
        if fbx_file: fbx_file.close()
        if image_file: image_file.close()
        if video_file: video_file.close()

        self.stdout.write(self.style.SUCCESS(
            f'¡Éxito! Se crearon {num_3d} proyectos 3D y {num_software} proyectos de software.'
        ))