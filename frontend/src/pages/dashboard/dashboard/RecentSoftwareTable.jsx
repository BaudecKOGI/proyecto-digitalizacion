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
import { Folder as FolderIcon } from "@phosphor-icons/react/dist/ssr/Folder";
import { Code as CodeIcon } from "@phosphor-icons/react/dist/ssr/Code";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import { useNavigate } from "react-router-dom";
import { paths } from "@/paths";

/**
 * TABLA RESUMEN DE ÚLTIMOS PROYECTOS DE SOFTWARE REGISTRADOS
 */
export default function RecentSoftwareTable({ proyectos = [] }) {
  const navigate = useNavigate();
  const recentItems = proyectos.slice(0, 4);

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
        <Avatar sx={{ bgcolor: "secondary.main", width: 36, height: 36 }}>
          <FolderIcon size={20} weight="fill" />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={800} color="text.primary">
            Últimos Proyectos de Software
          </Typography>
        </Box>
      </Box>

      {recentItems.length === 0 ? (
        <Box sx={{ p: 4, textAlign: "center", color: "text.secondary", flexGrow: 1 }}>
          <Typography variant="body2" fontWeight={600}>
            No hay proyectos de software registrados aún.
          </Typography>
        </Box>
      ) : (
        <TableContainer sx={{ flexGrow: 1 }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: "background.default" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>PROYECTO & AUTOR</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>CARRERA / CICLO</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>ESTADO</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentItems.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        src={item.imagen_portada}
                        variant="rounded"
                        sx={{ width: 40, height: 40, bgcolor: "action.hover" }}
                      >
                        <CodeIcon size={20} />
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
                    <Typography variant="caption" fontWeight={700} color="text.secondary" display="block">
                      {item.carrera || "No especificada"}
                    </Typography>
                    {item.ciclo && (
                      <Chip label={`Ciclo ${item.ciclo}`} size="small" sx={{ fontSize: "0.65rem", height: 20 }} />
                    )}
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
          onClick={() => navigate(paths.dashboard.proyectosDigitales)}
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
