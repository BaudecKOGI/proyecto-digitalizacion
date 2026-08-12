import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from "@mui/material";
import { MagnifyingGlass as SearchIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { FunnelX as ClearFilterIcon } from "@phosphor-icons/react/dist/ssr/FunnelX";
import { ODS_LIST } from "../odsData";

export default function ProyectosDigitalesFilters({
  searchTerm,
  setSearchTerm,
  filterOds,
  setFilterOds,
  filterCategoria,
  setFilterCategoria,
  filterEstado,
  setFilterEstado,
  categorias,
  hasActiveFilters,
  handleClearFilters
}) {
  return (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center"
      }}
    >
      <TextField
        size="small"
        placeholder="Buscar por título, autor o carrera..."
        label="Buscar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          minWidth: 260,
          flex: 1,
          "& .MuiOutlinedInput-root": {
            borderRadius: "2px",
            bgcolor: "#FFFFFF",
            "& fieldset": { borderColor: "rgba(0, 0, 0, 0.23)" },
            "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.4)" },
            "&.Mui-focused fieldset": { borderColor: "#002B49" }
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "#002B49" }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon size={20} color="#64748B" />
            </InputAdornment>
          )
        }}
      />

      <FormControl
        size="small"
        sx={{
          minWidth: 180,
          "& .MuiOutlinedInput-root": {
            borderRadius: "2px",
            bgcolor: "#FFFFFF",
            "& fieldset": { borderColor: "rgba(0, 0, 0, 0.23)" },
            "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.4)" },
            "&.Mui-focused fieldset": { borderColor: "#002B49" }
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "#002B49" }
        }}
      >
        <InputLabel>Filtrar ODS</InputLabel>
        <Select
          value={filterOds}
          label="Filtrar ODS"
          onChange={(e) => setFilterOds(e.target.value)}
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
          <MenuItem value=""><em>Todos los ODS</em></MenuItem>
          {ODS_LIST.map((o) => (
            <MenuItem key={o.id} value={o.id}>{o.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        size="small"
        sx={{
          minWidth: 170,
          "& .MuiOutlinedInput-root": {
            borderRadius: "2px",
            bgcolor: "#FFFFFF",
            "& fieldset": { borderColor: "rgba(0, 0, 0, 0.23)" },
            "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.4)" },
            "&.Mui-focused fieldset": { borderColor: "#002B49" }
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "#002B49" }
        }}
      >
        <InputLabel>Categorías</InputLabel>
        <Select
          value={filterCategoria}
          label="Categorías"
          onChange={(e) => setFilterCategoria(e.target.value)}
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
          <MenuItem value=""><em>Todas las Categorías</em></MenuItem>
          {categorias.map((c) => (
            <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        size="small"
        sx={{
          minWidth: 140,
          "& .MuiOutlinedInput-root": {
            borderRadius: "2px",
            bgcolor: "#FFFFFF",
            "& fieldset": { borderColor: "rgba(0, 0, 0, 0.23)" },
            "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.4)" },
            "&.Mui-focused fieldset": { borderColor: "#002B49" }
          },
          "& .MuiInputLabel-root.Mui-focused": { color: "#002B49" }
        }}
      >
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
          <MenuItem value=""><em>Todos</em></MenuItem>
          <MenuItem value="PUBLICADO">Publicado</MenuItem>
          <MenuItem value="BORRADOR">Borrador</MenuItem>
        </Select>
      </FormControl>

      {hasActiveFilters && (
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
          Limpiar filtros
        </Button>
      )}
    </Box>
  );
}
