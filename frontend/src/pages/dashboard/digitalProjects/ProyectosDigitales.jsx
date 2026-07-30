import * as React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Paper,
  CircularProgress,
  Stack,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert
} from "@mui/material";

import { MagnifyingGlass as SearchIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { FunnelX as ClearFilterIcon } from "@phosphor-icons/react/dist/ssr/FunnelX";

import {
  fetchProyectosSoftwareAdmin,
  createProyectoSoftware,
  updateProyectoSoftware,
  deleteProyectoSoftware,
  fetchTecnologias,
  createTecnologia,
  updateTecnologia,
  deleteTecnologia,
  fetchCategorias
} from "@/services/api";

import { ODS_LIST } from "./odsData";
import ProyectosTable from "./ProyectosTable";
import TecnologiasGrid from "./TecnologiasGrid";
import ProyectoFormModal from "./ProyectoFormModal";
import TecnologiaFormModal from "./TecnologiaFormModal";
import ProjectDetailView from "./ProjectDetailView";
import VideoPlayerModal from "./VideoPlayerModal";

export default function ProyectosDigitalesPage() {
  const [activeTab, setActiveTab] = useState(0);

  // Estados Proyectos Software
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOds, setFilterOds] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  // Catálogos auxiliares
  const [tecnologias, setTecnologias] = useState([]);
  const [categorias, setCategorias] = useState([]);

  // Modales Proyecto Form
  const [openModalProyecto, setOpenModalProyecto] = useState(false);
  const [editingProyecto, setEditingProyecto] = useState(null);
  const [formProyecto, setFormProyecto] = useState({
    titulo: "",
    descripcion: "",
    autor_nombre: "",
    carrera: "",
    ciclo: "VI",
    categoria: "",
    ods: "",
    estado_publicacion: "BORRADOR",
    url_repositorio: "",
    url_demo_live: "",
    tecnologias: [],
    creado_por: 1
  });
  const [archivoPortada, setArchivoPortada] = useState(null);
  const [archivoVideo, setArchivoVideo] = useState(null);

  // VISTA EN DETALLE INTEGRADA (NO FLOTANTE)
  const [viewingProyecto, setViewingProyecto] = useState(null);

  // Modal Reproductor de Video Flotante (Solo para clic en portada de la tabla)
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [playingProyecto, setPlayingProyecto] = useState(null);

  // Modales Tecnología Form
  const [openModalTech, setOpenModalTech] = useState(false);
  const [editingTech, setEditingTech] = useState(null);
  const [formTechName, setFormTechName] = useState("");

  // Notificaciones
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [formError, setFormError] = useState("");

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [proys, techs, cats] = await Promise.all([
        fetchProyectosSoftwareAdmin({
          search: searchTerm,
          ods: filterOds,
          categoria: filterCategoria,
          estado: filterEstado
        }),
        fetchTecnologias(),
        fetchCategorias()
      ]);
      setProyectos(Array.isArray(proys) ? proys : proys.results || []);
      setTecnologias(Array.isArray(techs) ? techs : techs.results || []);
      setCategorias(Array.isArray(cats) ? cats : cats.results || []);
    } catch (err) {
      showSnackbar("Error cargando datos de Proyectos Digitales", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [searchTerm, filterOds, filterCategoria, filterEstado]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterOds("");
    setFilterCategoria("");
    setFilterEstado("");
  };

  const hasActiveFilters = Boolean(searchTerm || filterOds || filterCategoria || filterEstado);

  // ==========================================
  // MANEJADORES PROYECTOS SOFTWARE
  // ==========================================
  const handleOpenCreateProyecto = () => {
    setEditingProyecto(null);
    setFormProyecto({
      titulo: "",
      descripcion: "",
      autor_nombre: "",
      carrera: "",
      ciclo: "VI",
      categoria: categorias[0]?.id || "",
      ods: "",
      estado_publicacion: "BORRADOR",
      url_repositorio: "",
      url_demo_live: "",
      tecnologias: [],
      creado_por: 1
    });
    setArchivoPortada(null);
    setArchivoVideo(null);
    setFormError("");
    setOpenModalProyecto(true);
  };

  const handleOpenEditProyecto = (p) => {
    setEditingProyecto(p);
    setFormProyecto({
      titulo: p.titulo || "",
      descripcion: p.descripcion || "",
      autor_nombre: p.autor_nombre || "",
      carrera: p.carrera || "",
      ciclo: p.ciclo || "VI",
      categoria: p.categoria || "",
      ods: p.ods || "",
      estado_publicacion: p.estado_publicacion || "BORRADOR",
      url_repositorio: p.url_repositorio || "",
      url_demo_live: p.url_demo_live || "",
      tecnologias: (p.tecnologias_detalle || []).map((t) => t.id),
      creado_por: p.creado_por || 1
    });
    setArchivoPortada(null);
    setArchivoVideo(null);
    setFormError("");
    setOpenModalProyecto(true);
  };

  const handleOpenViewProyecto = (p) => {
    setViewingProyecto(p);
  };

  const handleOpenVideo = (p) => {
    setPlayingProyecto(p);
    setOpenVideoModal(true);
  };

  const handleSaveProyecto = async (e) => {
    e.preventDefault();
    if (!formProyecto.titulo.trim() || !formProyecto.autor_nombre.trim() || !formProyecto.carrera.trim()) {
      setFormError("El título, autor y carrera son obligatorios.");
      return;
    }
    setFormError("");

    try {
      const formData = new FormData();
      formData.append("titulo", formProyecto.titulo.trim());
      formData.append("descripcion", formProyecto.descripcion.trim());
      formData.append("autor_nombre", formProyecto.autor_nombre.trim());
      formData.append("carrera", formProyecto.carrera.trim());
      formData.append("ciclo", formProyecto.ciclo);
      formData.append("estado_publicacion", formProyecto.estado_publicacion);
      formData.append("creado_por", formProyecto.creado_por);

      if (formProyecto.categoria) formData.append("categoria", formProyecto.categoria);
      if (formProyecto.ods) formData.append("ods", formProyecto.ods);
      if (formProyecto.url_repositorio) formData.append("url_repositorio", formProyecto.url_repositorio.trim());
      if (formProyecto.url_demo_live) formData.append("url_demo_live", formProyecto.url_demo_live.trim());

      formProyecto.tecnologias.forEach((techId) => {
        formData.append("tecnologias", techId);
      });

      if (archivoPortada) formData.append("imagen_portada", archivoPortada);
      if (archivoVideo) formData.append("archivo_video", archivoVideo);

      if (editingProyecto) {
        const updated = await updateProyectoSoftware(editingProyecto.id, formData);
        showSnackbar("Proyecto actualizado correctamente", "success");
        if (viewingProyecto && viewingProyecto.id === editingProyecto.id) {
          setViewingProyecto(updated);
        }
      } else {
        await createProyectoSoftware(formData);
        showSnackbar("Proyecto de software creado con éxito", "success");
      }
      setOpenModalProyecto(false);
      loadAllData();
    } catch (err) {
      setFormError(err.message || "Error al guardar el proyecto de software.");
    }
  };

  const handleDeleteProyecto = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este proyecto de software?")) return;
    try {
      await deleteProyectoSoftware(id);
      showSnackbar("Proyecto eliminado correctamente", "success");
      if (viewingProyecto && viewingProyecto.id === id) {
        setViewingProyecto(null);
      }
      loadAllData();
    } catch (err) {
      showSnackbar("Error al eliminar el proyecto", "error");
    }
  };

  // ==========================================
  // MANEJADORES TECNOLOGÍAS
  // ==========================================
  const handleOpenCreateTech = () => {
    setEditingTech(null);
    setFormTechName("");
    setFormError("");
    setOpenModalTech(true);
  };

  const handleOpenEditTech = (t) => {
    setEditingTech(t);
    setFormTechName(t.nombre || "");
    setFormError("");
    setOpenModalTech(true);
  };

  const handleSaveTech = async (e) => {
    e.preventDefault();
    if (!formTechName.trim()) {
      setFormError("El nombre de la tecnología es obligatorio.");
      return;
    }
    try {
      if (editingTech) {
        await updateTecnologia(editingTech.id, { nombre: formTechName.trim() });
        showSnackbar("Tecnología actualizada correctamente", "success");
      } else {
        await createTecnologia({ nombre: formTechName.trim() });
        showSnackbar("Tecnología agregada con éxito", "success");
      }
      setOpenModalTech(false);
      loadAllData();
    } catch (err) {
      setFormError(err.message || "Error al guardar la tecnología");
    }
  };

  const handleDeleteTech = async (id) => {
    if (!window.confirm("¿Eliminar esta tecnología del catálogo?")) return;
    try {
      await deleteTecnologia(id);
      showSnackbar("Tecnología eliminada", "success");
      loadAllData();
    } catch (err) {
      showSnackbar("No se pudo eliminar la tecnología", "error");
    }
  };

  return (
    <Box sx={{ pt: 0, pb: 4, px: { xs: 1, sm: 2 }, maxWidth: 1280, margin: "0 auto" }}>
      {/* SI ESTAMOS EN VISTA TÉCNICA DETALLADA (NO FLOTANTE), RENDERIZAMOS LA FICHA TÉCNICA */}
      {viewingProyecto ? (
        <ProjectDetailView
          proyecto={viewingProyecto}
          onBack={() => setViewingProyecto(null)}
          onEdit={handleOpenEditProyecto}
          onDelete={handleDeleteProyecto}
        />
      ) : (
        <>
          {/* Encabezado Principal */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              mb: 4,
              flexWrap: "wrap",
              gap: 2
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", mb: 0.5 }}>
                Gestión de Proyectos Digitales & Software
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Administra proyectos de software, repositorios, demos vivas, videos, tecnologías y ODS.
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              {activeTab === 0 ? (
                <Button
                  variant="contained"
                  startIcon={<PlusIcon />}
                  onClick={handleOpenCreateProyecto}
                  sx={{
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3,
                    boxShadow: "0px 4px 12px rgba(99, 102, 241, 0.25)"
                  }}
                >
                  Nuevo Proyecto Software
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<PlusIcon />}
                  onClick={handleOpenCreateTech}
                  sx={{
                    borderRadius: 2.5,
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3
                  }}
                >
                  Nueva Tecnología
                </Button>
              )}
            </Stack>
          </Box>

          {/* Pestañas (Proyectos vs Tecnologías) */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={(e, val) => setActiveTab(val)}
              sx={{
                "& .MuiTab-root": { textTransform: "none", fontWeight: 700, fontSize: "0.95rem" }
              }}
            >
              <Tab label={`Proyectos Software (${proyectos.length})`} />
              <Tab label={`Catálogo de Tecnologías (${tecnologias.length})`} />
            </Tabs>
          </Box>

          {/* PESTAÑA 0: PROYECTOS SOFTWARE */}
          {activeTab === 0 && (
            <Box>
              {/* Barra de Búsqueda y Filtros */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  mb: 3,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  alignItems: "center"
                }}
              >
                <TextField
                  size="small"
                  placeholder="Buscar por título, autor o carrera..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ minWidth: 260, flex: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon size={20} />
                      </InputAdornment>
                    )
                  }}
                />

                {/* Filtro por ODS */}
                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>Filtrar ODS</InputLabel>
                  <Select
                    value={filterOds}
                    label="Filtrar ODS"
                    onChange={(e) => setFilterOds(e.target.value)}
                  >
                    <MenuItem value=""><em>Todos los ODS</em></MenuItem>
                    {ODS_LIST.map((o) => (
                      <MenuItem key={o.id} value={o.id}>{o.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Filtro por Categoría */}
                <FormControl size="small" sx={{ minWidth: 170 }}>
                  <InputLabel>Categoría</InputLabel>
                  <Select
                    value={filterCategoria}
                    label="Categoría"
                    onChange={(e) => setFilterCategoria(e.target.value)}
                  >
                    <MenuItem value=""><em>Todas las Categorías</em></MenuItem>
                    {categorias.map((c) => (
                      <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Filtro por Estado */}
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    value={filterEstado}
                    label="Estado"
                    onChange={(e) => setFilterEstado(e.target.value)}
                  >
                    <MenuItem value=""><em>Todos</em></MenuItem>
                    <MenuItem value="PUBLICADO">Publicado</MenuItem>
                    <MenuItem value="BORRADOR">Borrador</MenuItem>
                    <MenuItem value="ARCHIVADO">Archivado</MenuItem>
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
                      borderRadius: 1.5,
                      borderColor: "divider",
                      color: "text.secondary",
                      px: 2,
                      py: 0.8
                    }}
                  >
                    Limpiar filtros
                  </Button>
                )}
              </Paper>

              {/* Contenido (Tabla Responsiva) */}
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <ProyectosTable
                  proyectos={proyectos}
                  onOpenCreate={handleOpenCreateProyecto}
                  onView={handleOpenViewProyecto}
                  onEdit={handleOpenEditProyecto}
                  onDelete={handleDeleteProyecto}
                  onPlayVideo={handleOpenVideo}
                />
              )}
            </Box>
          )}

          {/* PESTAÑA 1: CATÁLOGO DE TECNOLOGÍAS */}
          {activeTab === 1 && (
            <TecnologiasGrid
              tecnologias={tecnologias}
              onEdit={handleOpenEditTech}
              onDelete={handleDeleteTech}
            />
          )}
        </>
      )}

      {/* MODAL FORMULARIO PROYECTO */}
      <ProyectoFormModal
        open={openModalProyecto}
        onClose={() => setOpenModalProyecto(false)}
        onSave={handleSaveProyecto}
        editingProyecto={editingProyecto}
        formProyecto={formProyecto}
        setFormProyecto={setFormProyecto}
        archivoPortada={archivoPortada}
        setArchivoPortada={setArchivoPortada}
        archivoVideo={archivoVideo}
        setArchivoVideo={setArchivoVideo}
        categorias={categorias}
        tecnologias={tecnologias}
        formError={formError}
      />

      {/* MODAL FORMULARIO TECNOLOGÍA */}
      <TecnologiaFormModal
        open={openModalTech}
        onClose={() => setOpenModalTech(false)}
        onSave={handleSaveTech}
        editingTech={editingTech}
        formTechName={formTechName}
        setFormTechName={setFormTechName}
        formError={formError}
      />

      {/* MODAL REPRODUCTOR DE VIDEO FLOTANTE (Solo para clic en miniatura del listado) */}
      <VideoPlayerModal
        open={openVideoModal}
        onClose={() => setOpenVideoModal(false)}
        proyecto={playingProyecto}
      />

      {/* SNACKBAR */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
