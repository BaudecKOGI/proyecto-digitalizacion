import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Paper
} from "@mui/material";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { Cube as CubeIcon } from "@phosphor-icons/react/dist/ssr/Cube";
import { Folder as FolderIcon } from "@phosphor-icons/react/dist/ssr/Folder";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";

import { fetchProyectos3DAdmin, fetchProyectosSoftwareAdmin } from "@/services/api";

// Helper para números romanos
const toRoman = (num) => {
  const romanos = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  return romanos[num - 1] || num;
};

export default function CarreraCicloDetailView() {
  const { carrera, tipo, ciclo } = useParams();
  const navigate = useNavigate();
  const carreraNombre = decodeURIComponent(carrera);
  const cicloNum = Number(ciclo);
  const is3D = tipo === '3d';

  const [loading, setLoading] = React.useState(true);
  const [proyectos, setProyectos] = React.useState([]);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        const data = is3D 
          ? await fetchProyectos3DAdmin()
          : await fetchProyectosSoftwareAdmin();

        const array = Array.isArray(data) ? data : data?.results || [];

        const filtrados = array.filter(p => {
          const nombre = p.carrera_nombre || p.carrera?.nombre || '';
          const cicloP = p.ciclo || 0;
          return nombre.toLowerCase() === carreraNombre.toLowerCase() && cicloP === cicloNum;
        });

        setProyectos(filtrados);
      } catch (err) {
        console.error("Error cargando proyectos:", err);
        setError("No se pudieron cargar los proyectos.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [carreraNombre, cicloNum, is3D]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 4, maxWidth: 1360, margin: "0 auto" }}>
      {/* Cabecera */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowLeftIcon />}
          onClick={() => navigate(`/dashboard/carreras/${encodeURIComponent(carreraNombre)}`)}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            color: "text.secondary",
            mb: 1,
            "&:hover": { color: "text.primary" }
          }}
        >
          Volver a Ciclos de {carreraNombre}
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#111827" }}>
          {carreraNombre} - Ciclo {toRoman(cicloNum)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {is3D ? 'Diseños 3D' : 'Proyectos de Software'} registrados en este ciclo.
        </Typography>
      </Box>

      {proyectos.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 2,
            border: "1px dashed",
            borderColor: "divider",
            bgcolor: "background.paper"
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No hay proyectos {is3D ? '3D' : 'de software'} en este ciclo.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {proyectos.map((proyecto) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={proyecto.id}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "6px",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
                  }
                }}
              >
                {/* Miniatura o imagen de portada */}
                <Box
                  sx={{
                    height: 160,
                    bgcolor: is3D ? '#1e293b' : '#0f111a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  {is3D ? (
                    proyecto.imagen_miniatura ? (
                      <img
                        src={proyecto.imagen_miniatura}
                        alt={proyecto.titulo}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <CubeIcon size={48} color="rgba(255,255,255,0.2)" />
                    )
                  ) : (
                    proyecto.imagen_portada ? (
                      <img
                        src={proyecto.imagen_portada}
                        alt={proyecto.titulo}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <FolderIcon size={48} color="rgba(255,255,255,0.2)" />
                    )
                  )}
                  <Chip
                    label={proyecto.estado_publicacion || 'BORRADOR'}
                    size="small"
                    color={proyecto.estado_publicacion === 'PUBLICADO' ? 'success' : 'default'}
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      fontWeight: 700,
                      fontSize: '0.65rem',
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: '#fff',
                      backdropFilter: 'blur(4px)'
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {proyecto.titulo}
                  </Typography>

                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <UserIcon size={14} color="#64748B" />
                    <Typography variant="body2" color="text.secondary">
                      {proyecto.autor_nombre || 'Anónimo'}
                    </Typography>
                  </Stack>

                  {proyecto.descripcion && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: 1.5
                      }}
                    >
                      {proyecto.descripcion}
                    </Typography>
                  )}

                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                    {proyecto.categoria_nombre && (
                      <Chip
                        label={proyecto.categoria_nombre}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', fontWeight: 600 }}
                      />
                    )}
                    {proyecto.ods && (
                      <Chip
                        label={`ODS ${proyecto.ods}`}
                        size="small"
                        sx={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          bgcolor: '#f05c36',
                          color: '#fff'
                        }}
                      />
                    )}
                  </Stack>
                </CardContent>

                <Box
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: 'background.default'
                  }}
                >
                  <Typography variant="caption" color="text.disabled">
                    {new Date(proyecto.created_at).toLocaleDateString('es-ES')}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      if (is3D) {
                        navigate(`/dashboard/disenos-3d/detalle/${proyecto.id}`);
                      } else {
                        navigate(`/dashboard/proyectos-digitales/detalle/${proyecto.id}`);
                      }
                    }}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    Ver Detalle
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}