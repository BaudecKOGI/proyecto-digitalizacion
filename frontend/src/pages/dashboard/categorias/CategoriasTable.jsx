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
  TablePagination
} from "@mui/material";

import { Tag as TagIcon } from "@phosphor-icons/react/dist/ssr/Tag";
import { Folder as FolderIcon } from "@phosphor-icons/react/dist/ssr/Folder";
import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { PencilSimple as EditIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";

// Función auxiliar para generar un color de acento según la categoría
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

/**
 * TABLA DE CATEGORÍAS
 */
export default function CategoriasTable({
  categorias = [],
  onView,
  onEdit,
  onDelete
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [sortOrder, setSortOrder] = React.useState("asc");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedCategorias = React.useMemo(() => {
    return [...categorias].sort((a, b) => {
      const nameA = (a.nombre || "").toLowerCase();
      const nameB = (b.nombre || "").toLowerCase();
      return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  }, [categorias, sortOrder]);

  const paginatedCategorias = React.useMemo(() => {
    return sortedCategorias.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedCategorias, page, rowsPerPage]);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "6px",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        bgcolor: "#FFFFFF",
        overflow: "hidden"
      }}
    >
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table>
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
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Box component="span">Categoría</Box>
                  <Box
                    component="span"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    title="Ordenar por nombre (A-Z / Z-A)"
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
                </Stack>
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF" }}>Descripción</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF" }}>Slug (URL)</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF" }}>Proyectos</TableCell>
              <TableCell sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF", textAlign: "right" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCategorias.map((cat) => {
              const accentColor = stringToColor(cat.nombre);
              const count = cat.proyectos_count || 0;

              return (
                <TableRow
                  key={cat.id}
                  hover
                  sx={{ "& td": { borderBottom: "1px solid rgba(0, 0, 0, 0.04)" }, "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {/* Categoría / Icono */}
                  <TableCell sx={{ py: 2.2 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: `${accentColor}1A`,
                          color: accentColor,
                          width: 44,
                          height: 44,
                          border: "1px solid",
                          borderColor: `${accentColor}33`,
                          fontWeight: 700
                        }}
                      >
                        <TagIcon size={22} weight="fill" />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.primary" }}>
                          {cat.nombre}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  {/* Descripción */}
                  <TableCell sx={{ maxWidth: 320 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        fontWeight: 500
                      }}
                    >
                      {cat.descripcion || "Sin descripción adicional"}
                    </Typography>
                  </TableCell>

                  {/* Slug */}
                  <TableCell>
                    <Chip
                      label={`#${cat.slug}`}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 700,
                        fontFamily: "monospace",
                        borderColor: "divider",
                        backgroundColor: "background.default"
                      }}
                    />
                  </TableCell>

                  {/* Proyectos count */}
                  <TableCell>
                    <Chip
                      icon={<FolderIcon size={14} />}
                      label={`${count} proyecto${count === 1 ? "" : "s"}`}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        backgroundColor: count > 0 ? "rgba(16, 185, 129, 0.1)" : "action.hover",
                        color: count > 0 ? "#10B981" : "text.secondary"
                      }}
                    />
                  </TableCell>

                  {/* Acciones */}
                  <TableCell sx={{ textAlign: "right" }}>
                    <Tooltip title="Ver proyectos relacionados">
                      <IconButton
                        onClick={() => onView(cat)}
                        sx={{ color: "text.secondary", "&:hover": { color: "info.main" } }}
                      >
                        <EyeIcon size={20} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar categoría">
                      <IconButton
                        onClick={() => onEdit(cat)}
                        sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
                      >
                        <EditIcon size={20} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar categoría">
                      <IconButton
                        onClick={() => onDelete(cat.id)}
                        sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
                      >
                        <TrashIcon size={20} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación al pie */}
      <TablePagination
        component="div"
        count={categorias.length}
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
    </Paper>
  );
}
