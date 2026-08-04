import * as React from "react";
import { Grid, Card, Box, Typography, Stack, IconButton, Checkbox, Tooltip, Fade } from "@mui/material";
import { PencilSimple as EditIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";

export default function TecnologiasGrid({ tecnologias, onEdit, onDelete, onDeleteMultiple }) {
  const [selected, setSelected] = React.useState([]);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleDeleteMultiple = () => {
    if (onDeleteMultiple) onDeleteMultiple(selected);
    setSelected([]);
  };

  return (
    <Box>
      {/* Barra de acción cuando hay selección */}
      <Fade in={selected.length > 0}>
        <Box
          sx={{
            mb: 2,
            px: 2,
            py: 1.2,
            bgcolor: "#FEF2F2",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: "#B91C1C" }}>
            {selected.length} tecnología{selected.length !== 1 ? "s" : ""} seleccionada{selected.length !== 1 ? "s" : ""}
          </Typography>
          <Tooltip title="Eliminar seleccionadas">
            <IconButton
              color="error"
              size="small"
              onClick={handleDeleteMultiple}
              sx={{
                bgcolor: "rgba(239, 68, 68, 0.08)",
                "&:hover": { bgcolor: "rgba(239, 68, 68, 0.16)" }
              }}
            >
              <TrashIcon size={18} weight="bold" />
            </IconButton>
          </Tooltip>
        </Box>
      </Fade>

      <Grid container spacing={3}>
        {tecnologias.map((tech) => {
          const isSelected = selected.includes(tech.id);
          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={tech.id}>
              <Card
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: "6px",
                  border: isSelected ? "1.5px solid #002B49" : "1px solid rgba(0, 0, 0, 0.05)",
                  boxShadow: isSelected ? "0 0 0 2px rgba(0, 43, 73, 0.1)" : "0 1px 2px rgba(0, 0, 0, 0.02)",
                  bgcolor: isSelected ? "rgba(0, 43, 73, 0.03)" : "#FFFFFF",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: isSelected
                      ? "0 0 0 2px rgba(0, 43, 73, 0.1), 0px 8px 24px rgba(0,0,0,0.06)"
                      : "0px 8px 24px rgba(0,0,0,0.06)"
                  }
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Checkbox
                    size="small"
                    checked={isSelected}
                    onChange={() => toggleSelect(tech.id)}
                    sx={{
                      p: 0.3,
                      color: "rgba(0, 0, 0, 0.3)",
                      "&.Mui-checked": { color: "#002B49" },
                      flexShrink: 0
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {tech.nombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Slug: {tech.slug}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0, ml: 1 }}>
                  <IconButton size="small" onClick={() => onEdit(tech)}>
                    <EditIcon size={16} />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => onDelete(tech.id)}>
                    <TrashIcon size={16} />
                  </IconButton>
                </Stack>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
