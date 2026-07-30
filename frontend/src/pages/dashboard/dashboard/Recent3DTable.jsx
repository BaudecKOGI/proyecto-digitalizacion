import * as React from "react";
import {
  Paper,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Chip,
  Avatar,
  Stack,
  Button
} from "@mui/material";
import { Cube as CubeIcon } from "@phosphor-icons/react/dist/ssr/Cube";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { useNavigate } from "react-router-dom";
import { paths } from "@/paths";

/**
 * TABLA RESUMEN DE ÚLTIMOS DISEÑOS 3D REGISTRADOS
 */
export default function Recent3DTable({ disenos = [], categorias = [] }) {
  const navigate = useNavigate();
  const recentItems = disenos.slice(0, 4);

  const getCategoriaNombre = (catId) => {
    const cat = categorias.find((c) => c.id === catId);
    return cat ? cat.nombre : "General";
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Box
        sx={{
          p: 2.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          gap: 1.5
        }}
      >
        <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36 }}>
          <CubeIcon size={20} weight="fill" />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={800} color="text.primary">
            Últimos Diseños 3D
          </Typography>
        </Box>
      </Box>

      {recentItems.length === 0 ? (
        <Box sx={{ p: 4, textAlign: "center", color: "text.secondary", flexGrow: 1 }}>
          <Typography variant="body2" fontWeight={600}>
            No hay diseños 3D registrados aún.
          </Typography>
        </Box>
      ) : (
        <TableContainer sx={{ flexGrow: 1 }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: "background.default" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>PROYECTO 3D</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>CATEGORÍA</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>ESTADO</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentItems.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        src={item.imagen_miniatura}
                        variant="rounded"
                        sx={{ width: 40, height: 40, bgcolor: "action.hover" }}
                      >
                        <CubeIcon size={20} />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={700} color="text.primary" noWrap sx={{ maxWidth: 180 }}>
                          {item.titulo}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                          Por: {item.autor_nombre}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getCategoriaNombre(item.categoria)}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600, fontSize: "0.7rem" }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      label={item.estado_publicacion}
                      size="small"
                      color={item.estado_publicacion === "PUBLICADO" ? "success" : "default"}
                      sx={{ fontWeight: 700, fontSize: "0.68rem" }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* PIE DE TABLA CON BOTÓN VIEW ALL */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderTop: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "flex-end",
          bgcolor: "background.paper"
        }}
      >
        <Button
          onClick={() => navigate(paths.dashboard.disenos3d)}
          endIcon={<ArrowRightIcon size={16} weight="bold" />}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            color: "text.primary",
            "&:hover": { bgcolor: "action.hover" }
          }}
        >
          View all
        </Button>
      </Box>
    </Paper>
  );
}
