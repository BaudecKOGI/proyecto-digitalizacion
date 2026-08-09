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
  Paper,
  TableSortLabel,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Stack,
  TablePagination
} from "@mui/material";

export default function MetricasRankingTable({ metricas = [] }) {
  const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
  
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("vistas");
  const [filterType, setFilterType] = useState("all");
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
      data = data.filter(item => item.proyecto_tipo === filterType);
    }

    return data.sort((a, b) => {
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
      } else if (orderBy === "titulo") {
        const titleA = a.proyecto_titulo ? a.proyecto_titulo.toLowerCase() : "";
        const titleB = b.proyecto_titulo ? b.proyecto_titulo.toLowerCase() : "";
        if (titleA < titleB) return order === "asc" ? -1 : 1;
        if (titleA > titleB) return order === "asc" ? 1 : -1;
        return 0;
      }

      if (valA < valB) {
        return order === "asc" ? -1 : 1;
      }
      if (valA > valB) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [metricas, order, orderBy, filterType]);

  if (!metricas || metricas.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ color: "#1E293B", fontWeight: 700 }}>
          Ranking de Proyectos
        </Typography>
        <FormControl size="small">
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            sx={{ 
              bgcolor: "#FFFFFF", 
              borderRadius: "6px", 
              fontWeight: 600, 
              fontSize: "0.85rem",
              minWidth: 150
            }}
          >
            <MenuItem value="all" sx={{ fontWeight: 600, fontSize: "0.85rem" }}>Todos los tipos</MenuItem>
            <MenuItem value="Modelo 3D" sx={{ fontWeight: 600, fontSize: "0.85rem" }}>Modelo 3D</MenuItem>
            <MenuItem value="Digital" sx={{ fontWeight: 600, fontSize: "0.85rem" }}>Digital</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: "8px",
          border: "1px solid rgba(0, 0, 0, 0.08)",
          bgcolor: "#FFFFFF"
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#F8FAFC" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: "#475569" }}>Miniatura</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569" }}>
                <TableSortLabel
                  active={orderBy === "titulo"}
                  direction={orderBy === "titulo" ? order : "asc"}
                  onClick={() => handleRequestSort("titulo")}
                >
                  Proyecto
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569" }}>Categoría</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "#475569" }}>Tipo</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: "#475569" }}>
                <TableSortLabel
                  active={orderBy === "vistas"}
                  direction={orderBy === "vistas" ? order : "asc"}
                  onClick={() => handleRequestSort("vistas")}
                >
                  Vistas
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: "#475569" }}>
                <TableSortLabel
                  active={orderBy === "likes"}
                  direction={orderBy === "likes" ? order : "asc"}
                  onClick={() => handleRequestSort("likes")}
                >
                  Likes
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: "#475569" }}>
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
                  "&:hover": { bgcolor: "#F8FAFC" }
                }}
              >
                <TableCell>
                  {row.proyecto_miniatura ? (
                    <img 
                      src={getImageUrl(row.proyecto_miniatura)} 
                      alt="Miniatura" 
                      style={{ width: 44, height: 44, borderRadius: 4, objectFit: "cover" }} 
                    />
                  ) : (
                    <Box sx={{ width: 44, height: 44, borderRadius: 1, bgcolor: "#F1F5F9" }} />
                  )}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#111827", textTransform: "capitalize" }}>
                    {row.proyecto_titulo ? row.proyecto_titulo.toLowerCase() : ""}
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
                      bgcolor: row.proyecto_tipo === "Modelo 3D" ? "#F59E0B20" : "#2563EB20",
                      color: row.proyecto_tipo === "Modelo 3D" ? "#D97706" : "#2563EB",
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#10B981" }}>
                    {row.vistas_totales || 0}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#EF4444" }}>
                    {row.likes_totales || 0}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#8B5CF6" }}>
                    {row.compartidos_totales || 0}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 50, { label: 'Todos', value: -1 }]}
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
      />
    </Box>
  );
}
