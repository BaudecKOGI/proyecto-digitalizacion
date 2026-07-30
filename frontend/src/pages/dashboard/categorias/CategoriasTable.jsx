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
  Stack
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
 * TABLA DE CATEGORÍAS (COMPONENTE MODULAR)
 * Muestra el listado de categorías y sus acciones principales (Ver en página, Editar, Eliminar).
 */
export default function CategoriasTable({
  categorias = [],
  onView,
  onEdit,
  onDelete
}) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 3,
        boxShadow: "0px 4px 25px rgba(0, 0, 0, 0.04)",
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden"
      }}
    >
      <Table>
        <TableHead sx={{ backgroundColor: "action.hover" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 800, py: 2 }}>CATEGORÍA</TableCell>
            <TableCell sx={{ fontWeight: 800, py: 2 }}>DESCRIPCIÓN</TableCell>
            <TableCell sx={{ fontWeight: 800, py: 2 }}>SLUG (URL)</TableCell>
            <TableCell sx={{ fontWeight: 800, py: 2 }}>PROYECTOS</TableCell>
            <TableCell sx={{ fontWeight: 800, py: 2, textAlign: "right" }}>ACCIONES</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categorias.map((cat) => {
            const accentColor = stringToColor(cat.nombre);
            const count = cat.proyectos_count || 0;

            return (
              <TableRow
                key={cat.id}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
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
                  <Tooltip title="Ver proyectos relacionados (vista integrada)">
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
  );
}
