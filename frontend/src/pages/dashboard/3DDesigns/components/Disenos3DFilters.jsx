import React from "react";
import {
  Box,
  Stack,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Tooltip,
  IconButton
} from "@mui/material";
import { MagnifyingGlass as SearchIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { FunnelX as ClearFilterIcon } from "@phosphor-icons/react/dist/ssr/FunnelX";
import { Table as TableIcon } from "@phosphor-icons/react/dist/ssr/Table";
import { SquaresFour as GridIcon } from "@phosphor-icons/react/dist/ssr/SquaresFour";
import { ODS_LIST } from "@/pages/dashboard/digitalProjects/odsData";

export default function Disenos3DFilters({
  searchTerm,
  setSearchTerm,
  filterEstado,
  setFilterEstado,
  selectedCategoria,
  setSelectedCategoria,
  categorias,
  selectedOds,
  setSelectedOds,
  tabValue,
  handleClearFilters,
  viewMode,
  setViewMode
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "2px",
      bgcolor: "#FFFFFF",
      "& fieldset": { borderColor: "rgba(0, 0, 0, 0.23)" },
      "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.4)" },
      "&.Mui-focused fieldset": { borderColor: "#002B49" }
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#002B49" }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
      >
        <Box sx={{ flexGrow: 1, minWidth: { xs: "100%", md: 320 } }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por título o nombre del autor..."
            label="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={textFieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon size={20} color="#64748B" />
                </InputAdornment>
              )
            }}
          />
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
          sx={{ flexShrink: 0 }}
        >
          <FormControl size="small" sx={{ minWidth: 200, width: { xs: "100%", sm: "auto" }, ...textFieldSx }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={filterEstado}
              label="Estado"
              onChange={(e) => setFilterEstado(e.target.value)}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: "6px",
                    "& .MuiMenuItem-root.Mui-selected": {
                      bgcolor: "#002B49",
                      color: "#FFFFFF",
                      "&:hover": { bgcolor: "#001e33" }
                    }
                  }
                }
              }}
            >
              <MenuItem value="">Todos los estados</MenuItem>
              <MenuItem value="PUBLICADO">Publicado</MenuItem>
              <MenuItem value="BORRADOR">Borrador</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200, width: { xs: "100%", sm: "auto" }, ...textFieldSx }}>
            <InputLabel>Categorías</InputLabel>
            <Select
              value={selectedCategoria}
              label="Categorías"
              onChange={(e) => setSelectedCategoria(e.target.value)}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: "6px",
                    "& .MuiMenuItem-root.Mui-selected": {
                      bgcolor: "#002B49",
                      color: "#FFFFFF",
                      "&:hover": { bgcolor: "#001e33" }
                    }
                  }
                }
              }}
            >
              <MenuItem value="">
                <em>Todas las categorías</em>
              </MenuItem>
              {categorias.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 220, width: { xs: "100%", sm: "auto" }, ...textFieldSx }}>
            <InputLabel>Filtros (ODS)</InputLabel>
            <Select
              value={selectedOds}
              label="Filtros (ODS)"
              onChange={(e) => setSelectedOds(e.target.value)}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: "6px",
                    "& .MuiMenuItem-root.Mui-selected": {
                      bgcolor: "#002B49",
                      color: "#FFFFFF",
                      "&:hover": { bgcolor: "#001e33" }
                    }
                  }
                }
              }}
            >
              <MenuItem value="">
                <em>Todos los ODS</em>
              </MenuItem>
              {ODS_LIST.map((o) => (
                <MenuItem key={o.id} value={o.id}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Stack direction="row" spacing={1} alignItems="center">
            {(searchTerm || selectedCategoria || selectedOds || filterEstado || tabValue !== "3d") && (
              <Tooltip title="Limpiar Filtros">
                <Button
                  size="small"
                  variant="outlined"
                  color="inherit"
                  startIcon={<ClearFilterIcon />}
                  onClick={handleClearFilters}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "2px",
                    borderColor: "rgba(0, 0, 0, 0.23)",
                    color: "#475569",
                    px: 2,
                    py: 0.8,
                    "&:hover": { borderColor: "#002B49", bgcolor: "rgba(0, 43, 73, 0.04)", color: "#002B49" }
                  }}
                >
                  Limpiar
                </Button>
              </Tooltip>
            )}

            <Tooltip title={viewMode === "table" ? "Cambiar a Cuadrícula" : "Cambiar a Tabla"}>
              <IconButton
                onClick={() => {
                  const next = viewMode === "table" ? "grid" : "table";
                  setViewMode(next);
                  localStorage.setItem("disenos3d_viewMode", next);
                }}
                sx={{
                  border: "1px solid rgba(0, 0, 0, 0.23)",
                  borderRadius: "2px",
                  bgcolor: "#FFFFFF",
                  color: "#002B49",
                  width: 40,
                  height: 40,
                  "&:hover": { bgcolor: "rgba(0, 43, 73, 0.04)", borderColor: "#002B49" }
                }}
              >
                {viewMode === "table" ? <GridIcon size={20} /> : <TableIcon size={20} />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
