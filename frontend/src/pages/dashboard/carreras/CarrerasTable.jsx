import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  CircularProgress,
  TablePagination,
  Card,
  Avatar
} from "@mui/material";

import { PencilSimple as EditIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { DotsThreeVertical } from "@phosphor-icons/react/dist/ssr/DotsThreeVertical";
import { DashboardLoader } from "@/components/dashboard/layout/DashboardLoader";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { GraduationCap as CarreraIcon } from "@phosphor-icons/react/dist/ssr/GraduationCap";

function formatCreationDate(dateString) {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch {
    return "—";
  }
}

export default function CarrerasTable({
  carreras = [],
  loading = false,
  totalCount = 0,
  page = 0,
  rowsPerPage = 5,
  onPageChange,
  onRowsPerPageChange,
  searchTerm = "",
  onEdit,
  onDelete,
  onOpenCreate,
  onNavigate
}) {
  const handleChangePage = (event, newPage) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  if (loading) {
    return <DashboardLoader text="Cargando carreras..." />;
  }

  // Estado "sin resultados" (búsqueda sin coincidencias)
  if (carreras.length === 0 && searchTerm) {
    return (
      <Card
        sx={{
          borderRadius: 2,
          p: 6,
          textAlign: "center",
          boxShadow: "none",
          border: "1px dashed",
          borderColor: "divider",
          bgcolor: "background.paper"
        }}
      >
        <Avatar
          src="/assets/icons/education.png"
          sx={{
            width: 56,
            height: 56,
            margin: "0 auto 16px",
            bgcolor: "transparent"
          }}
        />
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}>
          No se encontraron carreras
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, margin: "0 auto" }}>
          No hay carreras que coincidan con la búsqueda <strong>"{searchTerm}"</strong>.
        </Typography>
      </Card>
    );
  }

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: "6px",
          border: "1px solid rgba(0, 0, 0, 0.05)",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
          bgcolor: "#FFFFFF",
          overflowX: "auto"
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead
            sx={{
              bgcolor: "#FFFFFF",
              "& .MuiTableCell-root, & .MuiTableCell-head": {
                bgcolor: "#FFFFFF !important",
                color: "#000000 !important",
                fontWeight: "700 !important",
                textTransform: "none !important"
              }
            }}
          >
            <TableRow sx={{ bgcolor: "#FFFFFF" }}>
              <TableCell sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF" }}>
                Carrera
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF" }}>
                Código
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF" }}>
                Duración (ciclos)
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF" }}>
                Estado
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF" }}>
                Creada
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF" }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {carreras.map((carrera) => (
              <TableRow
                key={carrera.id}
                hover
                sx={{ "& td": { borderBottom: "1px solid rgba(0, 0, 0, 0.04)" }, "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <img 
                      src="/assets/icons/education.png" 
                      alt="Carrera" 
                      style={{ width: 28, height: 28, objectFit: 'contain' }} 
                    />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#111827" }}>
                        {carrera.nombre}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ color: "#475569", fontWeight: 500 }}>
                    {carrera.codigo || "—"}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ color: "#475569", fontWeight: 500 }}>
                    {carrera.duracion_ciclos}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      bgcolor: carrera.activo ? "#DCFCE7" : "#FEE2E2",
                      color: carrera.activo ? "#166534" : "#991B1B",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      borderRadius: "6px",
                      px: 1.3,
                      py: 0.35
                    }}
                  >
                    {carrera.activo ? "Activa" : "Inactiva"}
                  </Box>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ color: "#475569", fontWeight: 500 }}>
                    {formatCreationDate(carrera.created_at)}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Stack direction="row" spacing={0.5} justifyContent="center">
                    <Tooltip title="Ver proyectos de esta carrera">
                      <IconButton
                        size="small"
                        onClick={() => onNavigate(`/dashboard/carreras/${encodeURIComponent(carrera.nombre)}`)}
                        sx={{
                          color: "#10B981",
                          "&:hover": { bgcolor: "rgba(16, 185, 129, 0.08)" }
                        }}
                      >
                        <EyeIcon size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar carrera">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(carrera)}
                        sx={{
                          color: "#64748B",
                          "&:hover": { color: "#002B49", bgcolor: "rgba(0, 43, 73, 0.04)" }
                        }}
                      >
                        <EditIcon size={18} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar carrera">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(carrera.id)}
                        sx={{
                          color: "#64748B",
                          "&:hover": { color: "#EF4444", bgcolor: "rgba(239, 68, 68, 0.08)" }
                        }}
                      >
                        <TrashIcon size={18} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`}
        sx={{
          borderTop: "1px solid rgba(0, 0, 0, 0.06)",
          color: "#475569",
          ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
            fontSize: "0.85rem",
            fontWeight: 500,
            margin: 0
          },
          ".MuiTablePagination-select": {
            borderRadius: "6px",
            border: "1px solid rgba(0, 0, 0, 0.08)",
            bgcolor: "#F8FAFC",
            py: 0.4,
            px: 1.2
          }
        }}
      />
    </>
  );
}