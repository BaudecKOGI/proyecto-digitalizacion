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
  Card,
  Menu,
  MenuItem,
  TablePagination
} from "@mui/material";

import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { PencilSimple as EditIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";
import { DotsThreeVertical } from "@phosphor-icons/react/dist/ssr/DotsThreeVertical";
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

export default function EditoresTable({
  editores = [],
  loading = false,
  searchTerm = "",
  onViewProjects,
  onEdit,
  onDelete,
  onOpenCreate
}) {
  const [sortOrder, setSortOrder] = React.useState("asc");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const [selectedEditorForMenu, setSelectedEditorForMenu] = React.useState(null);

  const handleOpenActionMenu = (event, editor) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedEditorForMenu(editor);
  };

  const handleCloseActionMenu = () => {
    setMenuAnchorEl(null);
    setSelectedEditorForMenu(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedEditores = React.useMemo(() => {
    return [...editores].sort((a, b) => {
      const nameA = (a.nombre || "").toLowerCase();
      const nameB = (b.nombre || "").toLowerCase();
      if (sortOrder === "asc") return nameA.localeCompare(nameB);
      return nameB.localeCompare(nameA);
    });
  }, [editores, sortOrder]);

  const paginatedEditores = React.useMemo(() => {
    return sortedEditores.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedEditores, page, rowsPerPage]);

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
            : "Crea el primer perfil de Editor para permitir que gestionen proyectos y veas su producción."}
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
        <Table sx={{ minWidth: 780 }}>
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
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "#000000",
                  textTransform: "none",
                  py: 1.8,
                  fontSize: "0.85rem",
                  borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                  bgcolor: "#FFFFFF"
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Box component="span">Nombre</Box>
                  <Box
                    component="span"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    title="Ordenar por iniciales (A-Z / Z-A)"
                    sx={{
                      cursor: "pointer",
                      userSelect: "none",
                      color: "#64748B",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      px: 0.5,
                      py: 0.2,
                      borderRadius: "4px",
                      transition: "all 0.15s ease",
                      "&:hover": { color: "#2563EB", bgcolor: "rgba(37, 99, 235, 0.08)" }
                    }}
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </Box>
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF" }}>
                Email
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF" }}>
                Rol
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF" }}>
                Creación
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF" }}>
                Diseños 3D
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF" }}>
                Software
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF" }}>
                Estado
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF" }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEditores.map((editor) => {
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
                  sx={{ "& td": { borderBottom: "1px solid rgba(0, 0, 0, 0.04)" }, "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {/* Editor / Avatar + Nombre */}
                  <TableCell sx={{ py: 1.8 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: avatarColor,
                          fontWeight: 700,
                          width: 38,
                          height: 38,
                          fontSize: "0.88rem"
                        }}
                      >
                        {initials}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#111827", fontSize: "0.88rem" }}>
                          {editor.nombre}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  {/* Correo Electrónico */}
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#475569", fontWeight: 500 }}>
                      {editor.email}
                    </Typography>
                  </TableCell>

                  {/* Rol */}
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#475569", fontWeight: 500 }}>
                      Editor
                    </Typography>
                  </TableCell>

                  {/* Fecha de creación */}
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "#475569", fontWeight: 500 }}>
                      {formatCreationDate(editor.date_joined || editor.created_at)}
                    </Typography>
                  </TableCell>

                  {/* Diseños 3D */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ color: p3dCount > 0 ? "#111827" : "#94A3B8", fontWeight: 600 }}>
                      {p3dCount}
                    </Typography>
                  </TableCell>

                  {/* Software */}
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ color: pSoftwareCount > 0 ? "#111827" : "#94A3B8", fontWeight: 600 }}>
                      {pSoftwareCount}
                    </Typography>
                  </TableCell>

                  {/* Estado */}
                  <TableCell>
                    <Box
                      component="span"
                      sx={{
                        display: "inline-block",
                        bgcolor: editor.is_active ? "#DCFCE7" : "#FEE2E2",
                        color: editor.is_active ? "#166534" : "#991B1B",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        borderRadius: "6px",
                        px: 1.3,
                        py: 0.35
                      }}
                    >
                      {editor.is_active ? "Activo" : "Inactivo"}
                    </Box>
                  </TableCell>

                  {/* Acciones centradas */}
                  <TableCell align="center">
                    <Tooltip title="Opciones">
                      <IconButton
                        size="small"
                        onClick={(e) => handleOpenActionMenu(e, editor)}
                        sx={{
                          color: "#64748B",
                          p: 0.8,
                          borderRadius: "6px",
                          "&:hover": { color: "#111827", bgcolor: "rgba(0,0,0,0.04)" }
                        }}
                      >
                        <DotsThreeVertical size={20} weight="bold" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación con estilo de la segunda imagen */}
      <TablePagination
        component="div"
        count={sortedEditores.length}
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

      {/* Menú desplegable para los 3 puntos de acción */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseActionMenu}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: "6px",
            border: "1px solid rgba(0, 0, 0, 0.06)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            minWidth: 190,
            py: 0.5
          }
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            if (selectedEditorForMenu && onViewProjects) onViewProjects(selectedEditorForMenu);
            handleCloseActionMenu();
          }}
          sx={{ fontSize: "0.85rem", fontWeight: 500, color: "#1E293B", py: 1 }}
        >
          <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <EyeIcon size={18} color="#10B981" /> Ver
          </Box>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedEditorForMenu && onEdit) onEdit(selectedEditorForMenu);
            handleCloseActionMenu();
          }}
          sx={{ fontSize: "0.85rem", fontWeight: 500, color: "#1E293B", py: 1 }}
        >
          <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <EditIcon size={18} color="#64748B" /> Editar
          </Box>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedEditorForMenu && onDelete) onDelete(selectedEditorForMenu);
            handleCloseActionMenu();
          }}
          sx={{ fontSize: "0.85rem", fontWeight: 500, color: "#EF4444", py: 1 }}
        >
          <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <TrashIcon size={18} color="#EF4444" /> Eliminar
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
}

