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
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  CircularProgress,
  Button,
  Card
} from "@mui/material";

import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { PencilSimple as EditIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { Envelope as EmailIcon } from "@phosphor-icons/react/dist/ssr/Envelope";
import { ShieldCheck as RoleIcon } from "@phosphor-icons/react/dist/ssr/ShieldCheck";
import { UserPlus as UserPlusIcon } from "@phosphor-icons/react/dist/ssr/UserPlus";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";

// Función auxiliar para color coherente de avatar
function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < (string || "").length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

export default function EditoresTable({
  editores = [],
  loading = false,
  searchTerm = "",
  onViewProjects,
  onEdit,
  onDelete,
  onOpenCreate
}) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress size={36} sx={{ color: "#6366F1" }} />
      </Box>
    );
  }

  if (editores.length === 0) {
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
          sx={{
            width: 56,
            height: 56,
            margin: "0 auto 16px",
            backgroundColor: "action.hover",
            color: "text.secondary"
          }}
        >
          <UserPlusIcon size={28} />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}>
          {searchTerm ? "No se encontraron editores coincidiendo con la búsqueda" : "No hay editores registrados"}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, margin: "0 auto 24px" }}>
          {searchTerm
            ? "Intenta buscar con otro nombre o correo electrónico."
            : "Crea el primer perfil de Editor para permitir que los encargados gestionen proyectos y veas su producción."}
        </Typography>
        {!searchTerm && (
          <Button
            variant="outlined"
            startIcon={<PlusIcon />}
            onClick={onOpenCreate}
            sx={{ borderRadius: 1.5, textTransform: "none", fontWeight: 600 }}
          >
            Crear primer editor
          </Button>
        )}
      </Card>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2,
        boxShadow: "none",
        border: "1px solid",
        borderColor: "divider",
        overflowX: "auto"
      }}
    >
      <Table sx={{ minWidth: 780 }}>
        <TableHead sx={{ backgroundColor: "action.hover" }}>
          <TableRow>
            <TableCell rowSpan={2} sx={{ fontWeight: 700, py: 2, fontSize: "0.75rem", borderBottom: "2px solid var(--mui-palette-divider)" }}>
              EDITOR
            </TableCell>
            <TableCell rowSpan={2} sx={{ fontWeight: 700, py: 2, fontSize: "0.75rem", borderBottom: "2px solid var(--mui-palette-divider)" }}>
              CORREO ELECTRÓNICO
            </TableCell>
            <TableCell rowSpan={2} sx={{ fontWeight: 700, py: 2, fontSize: "0.75rem", borderBottom: "2px solid var(--mui-palette-divider)" }}>
              ROL
            </TableCell>
            <TableCell
              colSpan={2}
              align="center"
              sx={{
                fontWeight: 800,
                py: 1.2,
                fontSize: "0.75rem",
                color: "#059669",
                borderBottom: "1px solid var(--mui-palette-divider)",
                borderLeft: "1px solid var(--mui-palette-divider)",
                borderRight: "1px solid var(--mui-palette-divider)",
                backgroundColor: "rgba(16, 185, 129, 0.04)"
              }}
            >
              TOTAL PROYECTOS
            </TableCell>
            <TableCell rowSpan={2} sx={{ fontWeight: 700, py: 2, fontSize: "0.75rem", borderBottom: "2px solid var(--mui-palette-divider)" }}>
              ESTADO
            </TableCell>
            <TableCell rowSpan={2} align="right" sx={{ fontWeight: 700, py: 2, fontSize: "0.75rem", borderBottom: "2px solid var(--mui-palette-divider)" }}>
              ACCIONES
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell
              align="center"
              sx={{
                fontWeight: 700,
                py: 1,
                fontSize: "0.75rem",
                color: "#059669",
                borderBottom: "2px solid var(--mui-palette-divider)",
                borderLeft: "1px solid var(--mui-palette-divider)",
                backgroundColor: "rgba(16, 185, 129, 0.04)"
              }}
            >
              DISEÑOS 3D
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontWeight: 700,
                py: 1,
                fontSize: "0.75rem",
                color: "#059669",
                borderBottom: "2px solid var(--mui-palette-divider)",
                borderRight: "1px solid var(--mui-palette-divider)",
                backgroundColor: "rgba(16, 185, 129, 0.04)"
              }}
            >
              DIGITALES
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {editores.map((editor) => {
            const avatarColor = stringToColor(editor.nombre);
            const initials = (editor.nombre || "?")
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();

            const p3dCount = editor.proyectos_3d_count || 0;
            const pSoftwareCount = editor.proyectos_software_count || 0;

            return (
              <TableRow
                key={editor.id}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {/* Editor / Avatar */}
                <TableCell sx={{ py: 1.8 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: avatarColor,
                        fontWeight: 700,
                        width: 40,
                        height: 40,
                        fontSize: "0.9rem"
                      }}
                    >
                      {initials}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "text.primary" }}>
                        {editor.nombre}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>

                {/* Correo */}
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <EmailIcon size={16} color="#6B7280" />
                    <Typography variant="body2" sx={{ color: "text.primary" }}>
                      {editor.email}
                    </Typography>
                  </Stack>
                </TableCell>

                {/* Rol */}
                <TableCell>
                  <Chip
                    icon={<RoleIcon size={14} />}
                    label="Editor FAB LAB"
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      bgcolor: "rgba(99, 102, 241, 0.08)",
                      color: "#6366F1",
                      border: "none"
                    }}
                  />
                </TableCell>

                {/* TOTAL PROYECTOS -> DISEÑOS 3D */}
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: p3dCount > 0 ? "text.primary" : "text.disabled",
                    borderLeft: "1px solid var(--mui-palette-divider)",
                    backgroundColor: "rgba(16, 185, 129, 0.015)"
                  }}
                >
                  {p3dCount}
                </TableCell>

                {/* TOTAL PROYECTOS -> DIGITALES */}
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: pSoftwareCount > 0 ? "text.primary" : "text.disabled",
                    borderRight: "1px solid var(--mui-palette-divider)",
                    backgroundColor: "rgba(16, 185, 129, 0.015)"
                  }}
                >
                  {pSoftwareCount}
                </TableCell>

                {/* Estado */}
                <TableCell>
                  <Chip
                    label={editor.is_active ? "Activo" : "Inactivo"}
                    size="small"
                    color={editor.is_active ? "success" : "default"}
                    variant="outlined"
                    sx={{ fontWeight: 600, fontSize: "0.75rem" }}
                  />
                </TableCell>

                {/* Acciones */}
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title="Ver proyectos subidos">
                      <IconButton
                        size="small"
                        onClick={() => onViewProjects && onViewProjects(editor)}
                        sx={{
                          color: "#10B981",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                          borderRadius: 1,
                          p: 0.8,
                          "&:hover": {
                            backgroundColor: "rgba(16, 185, 129, 0.1)"
                          }
                        }}
                      >
                        <EyeIcon size={18} weight="bold" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Editar cuenta">
                      <IconButton
                        size="small"
                        onClick={() => onEdit && onEdit(editor)}
                        sx={{
                          color: "text.secondary",
                          "&:hover": { color: "text.primary", bgcolor: "action.hover" }
                        }}
                      >
                        <EditIcon size={18} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Eliminar cuenta">
                      <IconButton
                        size="small"
                        onClick={() => onDelete && onDelete(editor)}
                        sx={{
                          color: "text.secondary",
                          "&:hover": { color: "error.main", bgcolor: "error.lighter" }
                        }}
                      >
                        <TrashIcon size={18} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
