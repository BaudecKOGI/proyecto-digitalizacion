import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Button,
  Stack,
  Divider,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link as MuiLink,
} from '@mui/material';
import {
  CaretDown as CaretDownIcon,
  Printer as PrinterIcon,
  ShieldCheck as ShieldCheckIcon,
  Cube as CubeIcon,
  Link as LinkIcon,
  FolderOpen as FolderOpenIcon,
  ChartBar as ChartBarIcon,
  Robot as RobotIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Question as QuestionIcon,
  EnvelopeSimple as EnvelopeIcon,
  CheckCircle as CheckCircleIcon,
  ArrowRight as ArrowRightIcon,
} from '@phosphor-icons/react';

// CONTENIDO DEL MANUAL
const sections = [
  {
    id: 'roles',
    icon: <ShieldCheckIcon size={22} weight="duotone" />,
    title: '1. Roles y Permisos',
    content: (
      <>
        <Typography paragraph>
          El sistema cuenta con dos roles principales para mantener la seguridad y el orden de los proyectos:
        </Typography>

        <List dense disablePadding sx={{ mb: 2 }}>
          <ListItem alignItems="flex-start" sx={{ px: 0 }}>
            <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
              <CheckCircleIcon size={20} color="#30C5D2" weight="fill" />
            </ListItemIcon>
            <ListItemText
              primary={<strong>Administrador</strong>}
              secondary="Tiene control total sobre el sistema. Puede aprobar o rechazar proyectos, generar enlaces de invitación, crear cuentas de editores, gestionar carreras, categorías y configurar parámetros globales."
            />
          </ListItem>
          <ListItem alignItems="flex-start" sx={{ px: 0 }}>
            <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
              <CheckCircleIcon size={20} color="#30C5D2" weight="fill" />
            </ListItemIcon>
            <ListItemText
              primary={<strong>Editor</strong>}
              secondary="Puede subir y editar sus propios proyectos. No puede administrar usuarios, generar enlaces de invitación ni configuraciones del sistema."
            />
          </ListItem>
        </List>

        <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
          Exportación de Datos (PDF y Excel)
        </Typography>
        <Typography paragraph>
          La gestión de roles (pantalla de Editores) cuenta con funcionalidad de exportación nativa.
          Los administradores pueden exportar el listado completo de usuarios activos, inactivos y administradores
          en formatos <strong>PDF</strong> y <strong>Excel (.xlsx)</strong> usando los botones ubicados en la parte superior de la tabla.
        </Typography>
      </>
    ),
  },
  {
    id: 'proyectos',
    icon: <CubeIcon size={22} weight="duotone" />,
    title: '2. Gestión de Proyectos (3D y Digitales)',
    content: (
      <>
        <Typography paragraph>
          Para subir o gestionar un proyecto, dirígete a las secciones <strong>"Modelos 3D"</strong> o <strong>"Proyectos Digitales"</strong> en el menú lateral.
        </Typography>

        <List dense disablePadding sx={{ mb: 2 }}>
          <ListItem alignItems="flex-start" sx={{ px: 0 }}>
            <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
              <ArrowRightIcon size={18} color="#30C5D2" weight="bold" />
            </ListItemIcon>
            <ListItemText
              primary={<strong>Añadir</strong>}
              secondary={
                <>
                  Haz clic en el botón superior derecho para crear un nuevo proyecto. Completa título, autor, carrera y sube los archivos.
                  <br />
                  <em>
                    Nota para 3D: Si diseñas en <strong>Fusion 360</strong>, ten en cuenta que para separar las piezas en el visor interactivo, cada pieza debe ser creada como un <strong>Componente</strong> individual (no como cuerpos dentro de un mismo componente). Luego, exporta el ensamblaje completo en formato <code>.fbx</code> para conservar las separaciones, materiales y jerarquías correctamente en el visor.
                  </em>
                </>
              }
            />
          </ListItem>
          <ListItem alignItems="flex-start" sx={{ px: 0 }}>
            <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
              <ArrowRightIcon size={18} color="#30C5D2" weight="bold" />
            </ListItemIcon>
            <ListItemText
              primary={<strong>Editar</strong>}
              secondary="En la tabla de proyectos, haz clic en el icono de lápiz para modificar cualquier información o actualizar los archivos del modelo."
            />
          </ListItem>
          <ListItem alignItems="flex-start" sx={{ px: 0 }}>
            <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
              <ArrowRightIcon size={18} color="#30C5D2" weight="bold" />
            </ListItemIcon>
            <ListItemText
              primary={<strong>Publicación</strong>}
              secondary={
                <>
                  Todo proyecto subido comienza como <strong>borrador</strong>. Los administradores pueden cambiar el estado a{' '}
                  <strong>"Público"</strong> para que aparezca automáticamente en la galería pública del FabLab UC.
                </>
              }
            />
          </ListItem>
        </List>

        <Alert severity="info" icon={<InfoIcon size={20} />} sx={{ mt: 1 }}>
          <strong>Recomendación:</strong> Antes de subir un modelo 3D, verifica que el archivo .fbx no exceda los límites de tamaño
          definidos por la plataforma para garantizar una carga fluida.
        </Alert>
      </>
    ),
  },
  {
    id: 'invitaciones',
    icon: <LinkIcon size={22} weight="duotone" />,
    title: '3. Sistema de Invitaciones',
    content: (
      <>
        <Typography paragraph>
          ¿Necesitas que un alumno suba su proyecto sin crear una cuenta en el sistema? Usa el sistema de invitaciones.
        </Typography>

        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
          Pasos para generar un enlace:
        </Typography>

        <List dense disablePadding sx={{ mb: 2 }}>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Chip label="1" size="small" color="primary" sx={{ height: 22, fontWeight: 700 }} />
            </ListItemIcon>
            <ListItemText primary='Ve a la pantalla de Proyectos (3D o Digitales) y haz clic en "Generar enlace".' />
          </ListItem>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Chip label="2" size="small" color="primary" sx={{ height: 22, fontWeight: 700 }} />
            </ListItemIcon>
            <ListItemText primary="Define el nombre del alumno y el tiempo de expiración (ejemplo: 24 horas)." />
          </ListItem>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Chip label="3" size="small" color="primary" sx={{ height: 22, fontWeight: 700 }} />
            </ListItemIcon>
            <ListItemText primary="Copia el Enlace Mágico y envíaselo al alumno." />
          </ListItem>
        </List>

        <Alert severity="warning" icon={<WarningIcon size={20} />} sx={{ mt: 1 }}>
          <strong>Importante:</strong> El alumno accederá a un formulario simplificado y seguro donde solo podrá subir su proyecto.
          Una vez subido (o si expira el tiempo), el enlace quedará invalidado automáticamente.
        </Alert>
      </>
    ),
  },
  {
    id: 'carreras',
    icon: <FolderOpenIcon size={22} weight="duotone" />,
    title: '4. Categorías y Carreras',
    content: (
      <>
        <Typography paragraph>
          Para mantener el catálogo ordenado, todos los proyectos deben pertenecer a una <strong>Categoría</strong> y a una <strong>Carrera</strong>.
        </Typography>
        <Typography paragraph>
          Los administradores pueden acceder a las pestañas correspondientes en el panel izquierdo para crear nuevas
          carreras o categorías (ej. Inteligencia Artificial, Impresión 3D, Robótica) y mantener la plataforma
          actualizada con el pensum universitario.
        </Typography>
        <Alert severity="info" icon={<InfoIcon size={20} />}>
          Mantener las categorías actualizadas mejora la experiencia de búsqueda y las estadísticas de la plataforma.
        </Alert>
      </>
    ),
  },
  {
    id: 'estadisticas',
    icon: <ChartBarIcon size={22} weight="duotone" />,
    title: '5. Visualizaciones y Estadísticas',
    content: (
      <>
        <Typography paragraph>
          El panel de <strong>Visualizaciones</strong> permite hacer seguimiento del tráfico y uso de la plataforma de forma integral.
        </Typography>
        <List dense disablePadding>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckCircleIcon size={18} color="#30C5D2" weight="fill" />
            </ListItemIcon>
            <ListItemText primary="Monitorea qué proyectos son los más visitados gracias a los contadores en tiempo real." />
          </ListItem>
          <ListItem sx={{ px: 0 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <CheckCircleIcon size={18} color="#30C5D2" weight="fill" />
            </ListItemIcon>
            <ListItemText primary="El sistema rastrea las visualizaciones tanto de Modelos 3D como de Proyectos Digitales." />
          </ListItem>
        </List>
      </>
    ),
  },
  {
    id: 'ia',
    icon: <RobotIcon size={22} weight="duotone" />,
    title: '6. Asistente de IA',
    content: (
      <>
        <Typography paragraph>
          El FabLab UC integra un poderoso asistente virtual.
        </Typography>
        <Typography paragraph>
          Este asistente tiene contexto total de la plataforma. Cualquier usuario puede abrir el chat (icono flotante)
          y hacer preguntas en lenguaje natural, por ejemplo:
        </Typography>
        <Box
          component="ul"
          sx={{
            pl: 2.5,
            mb: 2,
            '& li': { mb: 0.8 },
          }}
        >
          <li>
            <Typography variant="body2">
              <em>"¿Cuántos proyectos de Ingeniería Civil tenemos públicos?"</em>
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <em>"Dame un resumen de las categorías más populares."</em>
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <em>"Redacta un correo invitando a los alumnos a subir sus proyectos de IoT."</em>
            </Typography>
          </li>
        </Box>
        <Alert severity="info" icon={<InfoIcon size={20} />}>
          El asistente responde con base en los datos actuales de la plataforma. Úsalo como herramienta de apoyo,
          no como fuente única de verdad para reportes oficiales.
        </Alert>
      </>
    ),
  },
];

// COMPONENTE PRINCIPAL
export default function ManualPage() {
  const [expanded, setExpanded] = useState('roles');

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handlePrint = () => {
    // Expandimos todas las secciones antes de imprimir
    setExpanded('all');

    // Esperamos a que React actualice el DOM
    setTimeout(() => {
      window.print();
    }, 400);
  };

  const scrollToSection = (id) => {
    setExpanded(id);
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #printable-manual, #printable-manual * {
              visibility: visible;
            }
            #printable-manual {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 20px !important;
            }
            .no-print {
              display: none !important;
            }

            /* Forzar que todos los acordeones se vean abiertos */
            .MuiAccordion-root {
              box-shadow: none !important;
              border: none !important;
              margin: 0 0 16px 0 !important;
              page-break-inside: avoid;
            }
            .MuiAccordionSummary-root {
              min-height: auto !important;
              padding: 8px 0 !important;
            }
            .MuiAccordionSummary-content {
              margin: 0 !important;
            }
            .MuiAccordionDetails-root {
              display: block !important;
              visibility: visible !important;
              height: auto !important;
              padding: 8px 0 16px 0 !important;
              overflow: visible !important;
            }
            /* Ocultar el icono de flecha al imprimir */
            .MuiAccordionSummary-expandIconWrapper {
              display: none !important;
            }

            .MuiAlert-root {
              border: 1px solid #ccc !important;
              background-color: #f8f8f8 !important;
              page-break-inside: avoid;
            }

            /* Evitar que se corten títulos */
            h4, h6, .MuiTypography-h6 {
              page-break-after: avoid;
            }
          }
        `}
      </style>

      <Box component="main" sx={{ flexGrow: 1, py: { xs: 1, md: 2 }, px: { xs: 1, sm: 2 } }}>
        <Container maxWidth="xl" id="printable-manual" disableGutters>
          {/* HEADER */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
            mb={3}
          >
            <Box>
              <Typography variant="h4" fontWeight={700} sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }} gutterBottom>
                Manual de Usuario y Operaciones
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              startIcon={<PrinterIcon size={20} />}
              onClick={handlePrint}
              className="no-print"
              sx={{
                whiteSpace: 'nowrap',
                borderRadius: '2px'
              }}
            >
              Exportar a PDF
            </Button>
          </Stack>

          {/* INTRO */}
          <Card sx={{ mb: 4, borderLeft: '4px solid #30C5D2' }}>
            <CardContent>
              <Typography variant="body1" color="text.secondary">
                Bienvenido al manual oficial de la plataforma <strong>FabLab UC</strong>. Aquí encontrarás todas las
                instrucciones necesarias para gestionar proyectos, comprender los roles del sistema y utilizar las
                herramientas avanzadas.
              </Typography>
            </CardContent>
          </Card>

          {/* TABLA DE CONTENIDOS */}
          <Card variant="outlined" sx={{ mb: 4 }} className="no-print">
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Contenido
              </Typography>
              <Stack spacing={0.5}>
                {sections.map((section) => (
                  <MuiLink
                    key={section.id}
                    component="button"
                    underline="hover"
                    onClick={() => scrollToSection(section.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      textAlign: 'left',
                      color: 'text.primary',
                      py: 0.5,
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    <Box sx={{ color: '#30C5D2', display: 'flex' }}>{section.icon}</Box>
                    <Typography variant="body2">{section.title}</Typography>
                  </MuiLink>
                ))}
                <MuiLink
                  component="button"
                  underline="hover"
                  onClick={() => scrollToSection('faq')}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    textAlign: 'left',
                    color: 'text.primary',
                    py: 0.5,
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  <Box sx={{ color: '#30C5D2', display: 'flex' }}>
                    <QuestionIcon size={22} weight="duotone" />
                  </Box>
                  <Typography variant="body2">7. Preguntas Frecuentes</Typography>
                </MuiLink>
              </Stack>
            </CardContent>
          </Card>

          {/* SECCIONES */}
          {sections.map((section) => (
            <Accordion
              key={section.id}
              id={section.id}
              expanded={expanded === section.id || expanded === 'all'}
              onChange={handleChange(section.id)}
              sx={{
                mb: 1.5,
                borderRadius: '8px !important',
                '&:before': { display: 'none' },
                boxShadow: expanded === section.id || expanded === 'all' ? 2 : 0,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <AccordionSummary expandIcon={<CaretDownIcon size={20} />}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box sx={{ color: '#30C5D2', display: 'flex' }}>{section.icon}</Box>
                  <Typography variant="h6" fontWeight={600}>
                    {section.title}
                  </Typography>
                </Stack>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                <Divider sx={{ mb: 2 }} />
                {section.content}
              </AccordionDetails>
            </Accordion>
          ))}

          {/* FAQ */}
          <Accordion
            id="faq"
            expanded={expanded === 'faq' || expanded === 'all'}
            onChange={handleChange('faq')}
            sx={{
              mb: 1.5,
              borderRadius: '8px !important',
              '&:before': { display: 'none' },
              boxShadow: expanded === 'faq' || expanded === 'all' ? 2 : 0,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <AccordionSummary expandIcon={<CaretDownIcon size={20} />}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <Box sx={{ color: '#30C5D2', display: 'flex' }}>
                  <QuestionIcon size={22} weight="duotone" />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  7. Preguntas Frecuentes
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                ¿Puedo cambiar el estado de un proyecto a Público si soy Editor?
              </Typography>
              <Typography paragraph color="text.secondary">
                No. Solo los Administradores pueden cambiar el estado de un proyecto a Público.
              </Typography>

              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                ¿Qué pasa si el enlace de invitación expira?
              </Typography>
              <Typography paragraph color="text.secondary">
                El enlace queda invalidado automáticamente. Deberás generar uno nuevo desde la pantalla de proyectos.
              </Typography>

              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                ¿Qué formato debo usar para modelos 3D?
              </Typography>
              <Typography paragraph color="text.secondary">
                Se recomienda exportar en formato <code>.fbx</code> para garantizar compatibilidad con el visor interactivo.
              </Typography>

              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                ¿El Asistente de IA tiene acceso a datos sensibles?
              </Typography>
              <Typography color="text.secondary">
                El asistente opera con el contexto de la plataforma. Evita compartir información confidencial
                (contraseñas, datos personales sensibles) dentro del chat.
              </Typography>
            </AccordionDetails>
          </Accordion>

          {/* FOOTER */}
          <Box
            sx={{
              mt: 6,
              pt: 3,
              borderTop: '1px solid',
              borderColor: 'divider',
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              FabLab UC · Manual de Usuario y Operaciones
            </Typography>
            <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.5 }}>
              Documento oficial · Uso interno
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}