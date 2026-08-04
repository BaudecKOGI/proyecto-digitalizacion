import * as React from "react";
import {
  Paper,
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Avatar,
  Stack,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { paths } from "@/paths";

// TABLA RESUMEN DE ÚLTIMOS DISEÑOS 3D REGISTRADOS
export default function Recent3DTable({ disenos = [], categorias = [] }) {
  const navigate = useNavigate();
  const recentItems = disenos.slice(0, 4);

  const getCategoriaNombre = (catId) => {
    const cat = categorias.find((c) => c.id === catId);
    return cat ? cat.nombre : "General";
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "6px",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        bgcolor: "#FFFFFF",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* CABECERA */}
      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 2.5
        }}
      >
        <Typography sx={{ fontWeight: 700, color: "text.primary", fontSize: "1.15rem" }}>
          Últimos Diseños 3D
        </Typography>
      </Box>

      {recentItems.length === 0 ? (
        <Box sx={{ p: 4, textAlign: "center", color: "text.secondary", flexGrow: 1 }}>
          <Typography variant="body2" fontWeight={500}>
            No hay diseños 3D registrados aún.
          </Typography>
        </Box>
      ) : (
        <TableContainer sx={{ flexGrow: 1 }}>
          <Table size="small">
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
                <TableCell sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF", pl: 3 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF" }}>Proyecto</TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF" }}>Categoría</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: "#000000", textTransform: "none", py: 1.8, fontSize: "0.85rem", borderBottom: "1px solid rgba(0, 0, 0, 0.08)", bgcolor: "#FFFFFF", pr: 3 }}>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentItems.map((item, index) => (
                <TableRow key={item.id} hover sx={{ "& td": { borderBottom: "1px solid rgba(0, 0, 0, 0.04)" }, "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell sx={{ pl: 3, py: 2, color: "text.secondary", fontWeight: 600, fontSize: "0.85rem" }}>
                    {index + 1}
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar
                        src={item.imagen_miniatura}
                        variant="square"
                        sx={{ width: 36, height: 36, bgcolor: "action.hover", borderRadius: 0 }}
                      />
                      <Box>
                        <Typography variant="body2" fontWeight={600} color="text.primary" noWrap sx={{ maxWidth: 180 }}>
                          {item.titulo}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Por {item.autor_nombre}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ py: 2, color: "text.primary", fontWeight: 500, fontSize: "0.85rem" }}>
                    {getCategoriaNombre(item.categoria)}
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 3, py: 2, color: "text.secondary", fontWeight: 600, fontSize: "0.85rem" }}>
                    {item.estado_publicacion}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* PIE DE TABLA CON ENLACE ESTILO TEXTO SIN SÍMBOLOS */}
      <Box
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid rgba(0, 0, 0, 0.05)",
          display: "flex",
          justifyContent: "flex-end",
          bgcolor: "#FFFFFF"
        }}
      >
        <Button
          onClick={() => navigate(paths.dashboard.disenos3d)}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.9rem",
            color: "#0284C7",
            p: 0,
            minWidth: "auto",
            "&:hover": { bgcolor: "transparent", textDecoration: "underline" }
          }}
        >
          Ver todos los Diseños 3D
        </Button>
      </Box>
    </Paper>
  );
}
