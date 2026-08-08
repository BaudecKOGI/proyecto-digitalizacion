import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Stack,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Grid,
  Link
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { MagnifyingGlass as SearchIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { FunnelX as ClearFilterIcon } from "@phosphor-icons/react/dist/ssr/FunnelX";
import { Cube as CubeIcon } from "@phosphor-icons/react/dist/ssr/Cube";
import { Table as TableIcon } from "@phosphor-icons/react/dist/ssr/Table";
import { SquaresFour as GridIcon } from "@phosphor-icons/react/dist/ssr/SquaresFour";

import {
  fetchProyectos3DAdmin,
  createProyecto3D,
  updateProyecto3D,
  deleteProyecto3D,
  fetchCategorias
} from "@/services/api";

import { ODS_LIST } from "@/pages/dashboard/digitalProjects/odsData";
import Disenos3DTable from "./Disenos3DTable";
import Diseno3DFormView from "./Diseno3DFormView";
import Diseno3DDetailView from "./Diseno3DDetailView";
import Diseno3DDeleteModal from "./Diseno3DDeleteModal";

export default function Disenos3D() {

  const [disenos, setDisenos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pestañas (Filtro por estado de publicación)
  const [tabValue, setTabValue] = useState("todos");

  // Filtros de búsqueda y selectores
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [selectedOds, setSelectedOds] = useState("");

  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("disenos3d_viewMode") || "table";
  });

  const [activeView, setActiveView] = useState("list");

  const [selectedDiseno, setSelectedDiseno] = useState(null);

  // Elemento en edición
  const [editingDiseno, setEditingDiseno] = useState(null);

  // Formulario y archivos
  const [formDiseno, setFormDiseno] = useState({
    titulo: "",
    estado_publicacion: "BORRADOR",
    autor_nombre: "",
    carrera: "",
    ciclo: "",
    categoria: "",
    ods: "",
    descripcion: ""
  });
  const [archivoFBX, setArchivoFBX] = useState(null);
  const [imagenMiniatura, setImagenMiniatura] = useState(null);
  const [formError, setFormError] = useState("");

  // Notificaciones
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Modal de eliminación
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null, submitting: false });

  const loadData = async () => {
    setLoading(true);
    try {
      const [dataDisenos, dataCats] = await Promise.all([
        fetchProyectos3DAdmin({
          ods: selectedOds,
          categoria: selectedCategoria
        }),
        fetchCategorias()
      ]);

      const arrayDisenos = Array.isArray(dataDisenos) ? dataDisenos : dataDisenos?.results || [];
      const arrayCats = Array.isArray(dataCats) ? dataCats : dataCats?.results || [];

      setDisenos(arrayDisenos);
      setCategorias(arrayCats);
    } catch (err) {
      console.error("Error cargando modelos 3D:", err);
      setSnackbar({
        open: true,
        message: "No se pudo cargar la lista de modelos 3D.",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategoria, selectedOds]);

  // FILTRADO 
  const filteredDisenos = useMemo(() => {
    let list = disenos;
    if (tabValue !== "todos") {
      list = list.filter(item => item.estado_publicacion === tabValue);
    }
    if (!searchTerm.trim()) return list;
    const query = searchTerm.toLowerCase().trim();
    return list.filter(item => {
      const titulo = (item.titulo || "").toLowerCase();
      const autor = (item.autor_nombre || "").toLowerCase();
      const desc = (item.descripcion || "").toLowerCase();
      const carrera = (item.carrera || "").toLowerCase();
      return (
        titulo.includes(query) ||
        autor.includes(query) ||
        desc.includes(query) ||
        carrera.includes(query)
      );
    });
  }, [disenos, tabValue, searchTerm]);

  // Manejar ENTER en búsqueda
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategoria("");
    setSelectedOds("");
    setTabValue("todos");
  };

  // ACCIONES CRUD
  const handleOpenCreate = () => {
    setEditingDiseno(null);
    setFormDiseno({
      titulo: "",
      estado_publicacion: "BORRADOR",
      autor_nombre: "",
      carrera: "",
      ciclo: "",
      categoria: "",
      ods: "",
      descripcion: "",
      creado_por: 1
    });
    setArchivoFBX(null);
    setImagenMiniatura(null);
    setFormError("");
    setSelectedDiseno(null);
    setActiveView("form");
  };

  const handleOpenEdit = (item) => {
    setEditingDiseno(item);
    setFormDiseno({
      titulo: item.titulo || "",
      estado_publicacion: item.estado_publicacion || "BORRADOR",
      autor_nombre: item.autor_nombre || "",
      carrera: item.carrera || "",
      ciclo: item.ciclo || "",
      categoria: typeof item.categoria === "object" ? item.categoria?.id || "" : item.categoria || "",
      ods: item.ods || "",
      descripcion: item.descripcion || "",
      creado_por: item.creado_por || 1
    });
    setArchivoFBX(null);
    setImagenMiniatura(null);
    setFormError("");
    setSelectedDiseno(null);
    setActiveView("form");
  };

  const handleSaveDiseno = async (e, piezasMoviles = []) => {
    e.preventDefault();
    setFormError("");

    if (!formDiseno.titulo.trim()) {
      setFormError("El título del modelo 3D es obligatorio.");
      return;
    }
    if (!editingDiseno && !archivoFBX) {
      setFormError("Debes subir un archivo 3D (.fbx, .obj, .glb) para el nuevo modelo.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("titulo", formDiseno.titulo);
      formData.append("estado_publicacion", formDiseno.estado_publicacion);
      formData.append("autor_nombre", formDiseno.autor_nombre);
      formData.append("carrera", formDiseno.carrera);
      formData.append("ciclo", formDiseno.ciclo);
      formData.append("descripcion", formDiseno.descripcion);
      formData.append("creado_por", formDiseno.creado_por || 1);

      if (formDiseno.categoria) {
        formData.append("categoria", formDiseno.categoria);
      } else if (categorias.length > 0) {
        formData.append("categoria", categorias[0].id);
      }
      if (formDiseno.ods) {
        formData.append("ods", formDiseno.ods);
      }
      if (archivoFBX) {
        formData.append("archivo_fbx", archivoFBX);
      }
      if (imagenMiniatura) {
        formData.append("imagen_miniatura", imagenMiniatura);
      }
      if (piezasMoviles && Array.isArray(piezasMoviles)) {
        const configuracionJSON = JSON.stringify({ piezas_moviles: piezasMoviles });
        formData.append("configuracion_interactiva", configuracionJSON);
      }

      if (editingDiseno) {
        await updateProyecto3D(editingDiseno.id, formData);
        setSnackbar({
          open: true,
          message: "Modelo 3D actualizado exitosamente.",
          severity: "success"
        });
        if (selectedDiseno && selectedDiseno.id === editingDiseno.id) {
          setSelectedDiseno({
            ...selectedDiseno,
            ...formDiseno,
            categoria: categorias.find((c) => c.id === Number(formDiseno.categoria)) || formDiseno.categoria
          });
        }
      } else {
        await createProyecto3D(formData);
        setSnackbar({
          open: true,
          message: "Nuevo Modelo 3D creado con éxito.",
          severity: "success"
        });
      }

      setActiveView("list");
      loadData();
    } catch (err) {
      console.error("Error guardando proyecto 3D:", err);
      setFormError(err.message || "Error en el servidor al intentar guardar.");
    }
  };

  const handleDeleteDiseno = (item) => {
    setDeleteModal({ open: true, item, submitting: false });
  };

  const handleConfirmDelete = async () => {
    const item = deleteModal.item;
    if (!item) return;
    setDeleteModal((prev) => ({ ...prev, submitting: true }));
    try {
      await deleteProyecto3D(item.id);
      setSnackbar({
        open: true,
        message: `Modelo 3D "${item.titulo}" eliminado correctamente.`,
        severity: "success"
      });
      if (selectedDiseno && selectedDiseno.id === item.id) {
        setSelectedDiseno(null);
      }
      loadData();
    } catch (err) {
      console.error("Error eliminando modelo 3D:", err);
      setSnackbar({
        open: true,
        message: err.message || "No se pudo eliminar el modelo 3D.",
        severity: "error"
      });
    } finally {
      setDeleteModal({ open: false, item: null, submitting: false });
    }
  };

  // RENDERING: VISTA DETALLE O LISTADO
  if (selectedDiseno) {
    return (
      <Box sx={{ pb: 4, maxWidth: 1360, margin: "0 auto" }}>
        <Diseno3DDetailView
          diseno={selectedDiseno}
          categorias={categorias}
          onBack={() => setSelectedDiseno(null)}
          onEdit={(item) => handleOpenEdit(item)}
          onDelete={(item) => handleDeleteDiseno(item)}
        />
        <Diseno3DDeleteModal
          open={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, item: null, submitting: false })}
          onConfirm={handleConfirmDelete}
          submitting={deleteModal.submitting}
        />
      </Box>
    );
  }

  if (activeView === "form") {
    return (
      <Box sx={{ pb: 4, maxWidth: 1360, margin: "0 auto" }}>
        <Diseno3DFormView
          onBack={() => setActiveView("list")}
          onSave={handleSaveDiseno}
          editingDiseno={editingDiseno}
          formDiseno={formDiseno}
          setFormDiseno={setFormDiseno}
          archivoFBX={archivoFBX}
          setArchivoFBX={setArchivoFBX}
          imagenMiniatura={imagenMiniatura}
          setImagenMiniatura={setImagenMiniatura}
          categorias={categorias}
          formError={formError}
        />
      </Box>
    );
  }

  // KPIs Resumen
  const totalCount = disenos.length;
  const publicadosCount = disenos.filter((d) => d.estado_publicacion === "PUBLICADO").length;
  const borradorCount = disenos.filter((d) => d.estado_publicacion === "BORRADOR").length;

  return (
    <Box sx={{ pb: 4, maxWidth: 1360, margin: "0 auto" }}>
      {/* HEADER PRINCIPAL */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 500, display: "block", mb: 0.5 }}>
            <Link component={RouterLink} to="/dashboard" color="inherit" underline="hover">Inicio</Link> / Modelos 3D
          </Typography>
          <Typography variant="h4" fontWeight={800} sx={{ color: "text.primary" }}>
            Gestión de Modelos 3D
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Gestiona el catálogo de modelos interactivos, visor 3D, archivos .fbx y estado de publicación.
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="medium"
          startIcon={<PlusIcon weight="bold" />}
          onClick={handleOpenCreate}
          sx={{
            fontWeight: 600,
            borderRadius: "2px",
            px: 3.5,
            py: 1,
            bgcolor: "#002B49",
            color: "#FFFFFF",
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#001e33",
              boxShadow: "none"
            }
          }}
        >
          Nuevo Modelo 3D
        </Button>
      </Stack>

      {/* PESTAÑAS DE FILTRO POR ESTADO (Estilo Minimalista Negro con Contadores e Indicador al Ancho del Texto) */}
      <Box sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.08)", mb: 3.5 }}>
        <Stack direction="row" spacing={4}>
          {[
            { label: `Todos los Modelos: ${totalCount}`, value: "todos" },
            { label: `Publicaciones: ${publicadosCount}`, value: "PUBLICADO" },
            { label: `Borradores: ${borradorCount}`, value: "BORRADOR" }
          ].map((tab) => {
            const isSelected = tabValue === tab.value;
            return (
              <Box
                key={tab.value}
                onClick={() => setTabValue(tab.value)}
                sx={{
                  position: "relative",
                  pb: 1.5,
                  cursor: "pointer",
                  color: isSelected ? "#111827" : "#94A3B8",
                  fontWeight: isSelected ? 700 : 600,
                  fontSize: "0.98rem",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    color: "#111827"
                  },
                  "&::after": isSelected
                    ? {
                      content: '""',
                      position: "absolute",
                      bottom: -1,
                      left: 0,
                      right: 0,
                      height: "2.5px",
                      backgroundColor: "#111827",
                      borderRadius: "2px 2px 0 0"
                    }
                    : {}
                }}
              >
                {tab.label}
              </Box>
            );
          })}
        </Stack>
      </Box>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <Box sx={{ mb: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent="space-between"
        >
          {/* Campo de Búsqueda */}
          <Box sx={{ flexGrow: 1, minWidth: { xs: "100%", md: 320 } }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por título o nombre del autor..."
              label="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{
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
          </Box>

          {/* Grupo de Filtros Select y Botones */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
            sx={{ flexShrink: 0 }}
          >
            {/* Filtro por Categoría */}
            <FormControl
              size="small"
              sx={{
                minWidth: 200,
                width: { xs: "100%", sm: "auto" },
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

            {/* Filtro por ODS */}
            <FormControl
              size="small"
              sx={{
                minWidth: 220,
                width: { xs: "100%", sm: "auto" },
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
                    ODS {o.id}: {o.fullTitle || o.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Acciones de filtro y vista */}
            <Stack direction="row" spacing={1} alignItems="center">
              {(searchTerm || selectedCategoria || selectedOds) && (
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

              {/* Toggle vista tabla / cuadricula */}
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

      {/* TABLA O GRID DE MODELOS 3D */}
      <Disenos3DTable
        disenos={filteredDisenos}
        categorias={categorias}
        loading={loading}
        viewMode={viewMode}
        onView={(item) => setSelectedDiseno(item)}
        onEdit={(item) => handleOpenEdit(item)}
        onDelete={(item) => handleDeleteDiseno(item)}
      />

      {/* MODAL DE ELIMINACIÓN */}
      <Diseno3DDeleteModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null, submitting: false })}
        onConfirm={handleConfirmDelete}
        submitting={deleteModal.submitting}
      />

      {/* SNACKBAR COMUNICACIONES */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: 2, fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
