import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Stack,
  TablePagination,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Card,
} from "@mui/material";
import { MagnifyingGlass as SearchIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { X as CloseIcon } from "@phosphor-icons/react/dist/ssr/X";
import { Cube as CubeIcon } from "@phosphor-icons/react/dist/ssr/Cube";
import { Monitor as MonitorIcon } from "@phosphor-icons/react/dist/ssr/Monitor";

export default function MetricasRankingTable({ metricas = [] }) {
  const API_BASE = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:8000";

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("vistas");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedMetricas = useMemo(() => {
    let data = [...metricas];

    if (filterType !== "all") {
      data = data.filter((item) => item.proyecto_tipo === filterType);
    }

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(
        (item) =>
          (item.proyecto_titulo && item.proyecto_titulo.toLowerCase().includes(lowerSearch)) ||
          (item.proyecto_categoria && item.proyecto_categoria.toLowerCase().includes(lowerSearch))
      );
    }

    return data.sort((a, b) => {
      if (orderBy === "titulo") {
        const titleA = a.proyecto_titulo ? a.proyecto_titulo.toLowerCase() : "";
        const titleB = b.proyecto_titulo ? b.proyecto_titulo.toLowerCase() : "";
        if (titleA < titleB) return order === "asc" ? -1 : 1;
        if (titleA > titleB) return order === "asc" ? 1 : -1;
        return 0;
      }

      let valA = 0;
      let valB = 0;

      if (orderBy === "vistas") {
        valA = a.vistas_totales || 0;
        valB = b.vistas_totales || 0;
      } else if (orderBy === "likes") {
        valA = a.likes_totales || 0;
        valB = b.likes_totales || 0;
      } else if (orderBy === "compartidos") {
        valA = a.compartidos_totales || 0;
        valB = b.compartidos_totales || 0;
      }

      if (valA < valB) return order === "asc" ? -1 : 1;
      if (valA > valB) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [metricas, order, orderBy, filterType, searchTerm]);

  if (!metricas || metricas.length === 0) {
    return null;
  }

  return (
    <Card
      elevation={0}
      sx={{
        mt: 5,
        borderRadius: "12px",
        border: "1px solid rgba(0, 0, 0, 0.08)",
        bgcolor: "#FFFFFF",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* HEADER */}
      <Box sx={{ p: 3, borderBottom: "1px solid rgba(0, 0, 0, 0.05)" }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
        >
          <Typography variant="h6" sx={{ color: "#1E293B", fontWeight: 700 }}>
            Ranking de Proyectos
          </Typography>

          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
            sx={{ width: { xs: "100%", md: "auto" }, justifyContent: { xs: "flex-start", md: "flex-end" } }}
          >
            <TextField
              size="small"
              placeholder="Buscar proyecto..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              sx={{ minWidth: { xs: "100%", sm: 220 }, flexGrow: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon size={18} color="#64748B" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm("")}>
                      <CloseIcon size={14} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
                sx: {
                  bgcolor: "#FFFFFF",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                },
              }}
            />

            <FormControl size="small" sx={{ minWidth: 150, flexGrow: { xs: 1, sm: 0 } }}>
              <Select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setPage(0);
                }}
                sx={{
                  bgcolor: "#FFFFFF",
                  borderRadius: "6px",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                }}
              >
                <MenuItem value="all" sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
                  Todos los tipos
                </MenuItem>
                <MenuItem value="Modelo 3D" sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
                  Modelo 3D
                </MenuItem>
                <MenuItem value="Digital" sx={{ fontWeight: 600, fontSize: "0.85rem" }}>
                  Digital
                </MenuItem>
              </Select>
            </FormControl>

            {(searchTerm || filterType !== "all") && (
              <Button
                size="small"
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                  setPage(0);
                }}
                sx={{
                  textTransform: "none",
                  color: "#64748B",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                }}
              >
                Limpiar
              </Button>
            )}
          </Stack>
        </Stack>
      </Box>

      {/* TABLA */}
      <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
        <Table sx={{ minWidth: 750, width: "100%" }}>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: "#475569", width: 70 }}>
                Miniatura
              </TableCell>

              <TableCell sx={{ fontWeight: 600, color: "#475569", minWidth: 180 }}>
                <TableSortLabel
                  active={orderBy === "titulo"}
                  direction={orderBy === "titulo" ? order : "asc"}
                  onClick={() => handleRequestSort("titulo")}
                >
                  Proyecto
                </TableSortLabel>
              </TableCell>

              <TableCell sx={{ fontWeight: 600, color: "#475569", minWidth: 130 }}>
                Categoría
              </TableCell>

              <TableCell sx={{ fontWeight: 600, color: "#475569", width: 120 }}>
                Tipo
              </TableCell>

              {/* Vistas */}
              <TableCell align="center" sx={{ fontWeight: 600, color: "#475569", width: 100 }}>
                <TableSortLabel
                  active={orderBy === "vistas"}
                  direction={orderBy === "vistas" ? order : "asc"}
                  onClick={() => handleRequestSort("vistas")}
                >
                  Vistas
                </TableSortLabel>
              </TableCell>

              {/* Likes */}
              <TableCell align="center" sx={{ fontWeight: 600, color: "#475569", width: 90 }}>
                <TableSortLabel
                  active={orderBy === "likes"}
                  direction={orderBy === "likes" ? order : "asc"}
                  onClick={() => handleRequestSort("likes")}
                >
                  Likes
                </TableSortLabel>
              </TableCell>

              {/* Compartidos */}
              <TableCell align="center" sx={{ fontWeight: 600, color: "#475569", width: 120 }}>
                <TableSortLabel
                  active={orderBy === "compartidos"}
                  direction={orderBy === "compartidos" ? order : "asc"}
                  onClick={() => handleRequestSort("compartidos")}
                >
                  Compartidos
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(rowsPerPage > 0
              ? sortedMetricas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : sortedMetricas
            ).map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: "#F8FAFC" },
                }}
              >
                <TableCell>
                  {row.proyecto_miniatura ? (
                    <img
                      src={getImageUrl(row.proyecto_miniatura)}
                      alt="Miniatura"
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 4,
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 1,
                        bgcolor: "#F1F5F9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {row.proyecto_tipo === "Modelo 3D" ? (
                        <CubeIcon size={24} color="#94A3B8" weight="duotone" />
                      ) : (
                        <MonitorIcon size={24} color="#94A3B8" weight="duotone" />
                      )}
                    </Box>
                  )}
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: "#111827",
                      textTransform: "capitalize",
                    }}
                  >
                    {row.proyecto_titulo ? row.proyecto_titulo.toLowerCase() : "—"}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ color: "#64748B", fontWeight: 500 }}>
                    {row.proyecto_categoria || "Sin categoría"}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    label={row.proyecto_tipo || "Proyecto"}
                    size="small"
                    sx={{
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      bgcolor:
                        row.proyecto_tipo === "Modelo 3D" ? "#F59E0B20" : "#2563EB20",
                      color: row.proyecto_tipo === "Modelo 3D" ? "#D97706" : "#2563EB",
                    }}
                  />
                </TableCell>

                <TableCell align="center">
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#10B981" }}>
                    {row.vistas_totales || 0}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#EF4444" }}>
                    {row.likes_totales || 0}
                  </Typography>
                </TableCell>

                <TableCell align="center">
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#8B5CF6" }}>
                    {row.compartidos_totales || 0}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* PAGINACIÓN */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 50, { label: "Todos", value: -1 }]}
        component="div"
        count={sortedMetricas.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="Filas por página:"
        sx={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
      />
    </Card>
  );
}