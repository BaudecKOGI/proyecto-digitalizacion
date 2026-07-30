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
  Grid
} from "@mui/material";

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

export default function Disenos3D() {
  // ==========================
  // ESTADOS PRINCIPALES
  // ==========================
  const [disenos, setDisenos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pestañas (Filtro por estado de publicación)
  const [tabValue, setTabValue] = useState("todos");

  // Filtros de búsqueda y selectores
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [selectedOds, setSelectedOds] = useState("");

  // Modo de visualización: tabla o cuadrícula
  const [viewMode, setViewMode] = useState("table");

  // Vista activa: 'list' (listado/tabla) o 'form' (crear/editar integrado)
  const [activeView, setActiveView] = useState("list");

  // Vista de detalle a pantalla del admin
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

  // ==========================
  // CARGA DE DATOS
  // ==========================
  const loadData = async () => {
    setLoading(true);
    try {
      const estadoParam = tabValue === "todos" ? "" : tabValue;
      const [dataDisenos, dataCats] = await Promise.all([
        fetchProyectos3DAdmin({
          ods: selectedOds,
          categoria: selectedCategoria,
          estado: estadoParam
        }),
        fetchCategorias()
      ]);

      const arrayDisenos = Array.isArray(dataDisenos) ? dataDisenos : dataDisenos?.results || [];
      const arrayCats = Array.isArray(dataCats) ? dataCats : dataCats?.results || [];

      setDisenos(arrayDisenos);
      setCategorias(arrayCats);
    } catch (err) {
      console.error("Error cargando diseños 3D:", err);
      setSnackbar({
        open: true,
        message: "No se pudo cargar la lista de diseños 3D.",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tabValue, selectedCategoria, selectedOds]);

  // FILTRADO 
  const filteredDisenos = useMemo(() => {
    if (!searchTerm.trim()) return disenos;
    const query = searchTerm.toLowerCase().trim();
    return disenos.filter(item => {
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
  }, [disenos, searchTerm]);

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
      categoria: categorias[0]?.id || "",
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
      setFormError("El título del diseño 3D es obligatorio.");
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
          message: "Diseño 3D actualizado exitosamente.",
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
          message: "Nuevo Diseño 3D creado con éxito.",
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

  const handleDeleteDiseno = async (item) => {
    if (!window.confirm(`¿Estás seguro de eliminar el diseño 3D "${item.titulo}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      await deleteProyecto3D(item.id);
      setSnackbar({
        open: true,
        message: `Diseño 3D "${item.titulo}" eliminado correctamente.`,
        severity: "success"
      });
      if (selectedDiseno && selectedDiseno.id === item.id) {
        setSelectedDiseno(null);
      }
      loadData();
    } catch (err) {
      console.error("Error eliminando diseño 3D:", err);
      setSnackbar({
        open: true,
        message: err.message || "No se pudo eliminar el diseño 3D.",
        severity: "error"
      });
    }
  };

  // RENDERING: VISTA DETALLE O LISTADO
  if (selectedDiseno) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Diseno3DDetailView
          diseno={selectedDiseno}
          onBack={() => setSelectedDiseno(null)}
          onEdit={(item) => handleOpenEdit(item)}
          onDelete={(item) => handleDeleteDiseno(item)}
        />
      </Box>
    );
  }

  if (activeView === "form") {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
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
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* HEADER PRINCIPAL */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ color: "text.primary" }}>
            Administración de Diseños 3D
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
            fontWeight: 700,
            borderRadius: 1.5,
            px: 3,
            py: 1.2,
            textTransform: "none",
            boxShadow: "0 4px 14px rgba(0, 102, 255, 0.35)"
          }}
        >
          Nuevo Diseño 3D
        </Button>
      </Stack>

      {/* KPIS DE ESTADÍSTICA */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper"
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  TOTAL DISEÑOS 3D
                </Typography>
                <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
                  {totalCount}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: "primary.50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "primary.main"
                }}
              >
                <CubeIcon size={26} weight="duotone" />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper"
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  PUBLICADOS EN LANDING
                </Typography>
                <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5, color: "success.main" }}>
                  {publicadosCount}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: "success.50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "success.main"
                }}
              >
                <CubeIcon size={26} weight="fill" />
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper"
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                  EN BORRADOR / REVISIÓN
                </Typography>
                <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5, color: "warning.main" }}>
                  {borradorCount}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: "warning.50",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "warning.main"
                }}
              >
                <CubeIcon size={26} weight="regular" />
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      {/* PESTAÑAS DE FILTRO POR ESTADO */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newVal) => setTabValue(newVal)}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.95rem"
            }
          }}
        >
          <Tab label="Todos los Diseños" value="todos" />
          <Tab label="Publicados" value="PUBLICADO" />
          <Tab label="Borradores" value="BORRADOR" />
        </Tabs>
      </Box>

      {/* BARRA DE BÚSQUEDA Y FILTROS - DISEÑO FLEXBOX RESPONSIVO SIN TRUNCAMIENTOS */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper"
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
          justifyContent="space-between"
        >
          {/* Campo de Búsqueda */}
          <Box sx={{ flexGrow: 1, minWidth: { xs: "100%", md: 300 } }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por título o nombre del autor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon size={20} />
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
            <FormControl size="small" sx={{ minWidth: 200, width: { xs: "100%", sm: "auto" } }}>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={selectedCategoria}
                label="Categoría"
                onChange={(e) => setSelectedCategoria(e.target.value)}
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
            <FormControl size="small" sx={{ minWidth: 250, width: { xs: "100%", sm: "auto" } }}>
              <InputLabel>Objetivo ODS</InputLabel>
              <Select
                value={selectedOds}
                label="Objetivo ODS"
                onChange={(e) => setSelectedOds(e.target.value)}
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
                    sx={{ textTransform: "none", fontWeight: 600, borderRadius: 1.5, px: 2 }}
                  >
                    Limpiar
                  </Button>
                </Tooltip>
              )}

              {/* Toggle vista tabla / cuadricula */}
              <Tooltip title={viewMode === "table" ? "Cambiar a Cuadrícula" : "Cambiar a Tabla"}>
                <IconButton
                  onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
                  color="primary"
                  sx={{ border: "1px solid", borderColor: "divider", width: 40, height: 40 }}
                >
                  {viewMode === "table" ? <GridIcon size={20} /> : <TableIcon size={20} />}
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      {/* TABLA O GRID DE DISEÑOS 3D */}
      <Disenos3DTable
        disenos={filteredDisenos}
        loading={loading}
        viewMode={viewMode}
        onView={(item) => setSelectedDiseno(item)}
        onEdit={(item) => handleOpenEdit(item)}
        onDelete={(item) => handleDeleteDiseno(item)}
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
