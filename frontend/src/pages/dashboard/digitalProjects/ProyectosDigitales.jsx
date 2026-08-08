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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Link
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

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
import ProyectoDeleteModal from "./ProyectoDeleteModal";
import TecnologiaDeleteModal from "./TecnologiaDeleteModal";

export default function ProyectosDigitalesPage() {
  const [activeTab, setActiveTab] = useState(0);

  // Estados Proyectos Digitales
  const [proyectos, setProyectos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOds, setFilterOds] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const [tecnologias, setTecnologias] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [openModalProyecto, setOpenModalProyecto] = useState(false);
  const [editingProyecto, setEditingProyecto] = useState(null);
  const [formProyecto, setFormProyecto] = useState({
    titulo: "",
    descripcion: "",
    autor_nombre: "",
    carrera: null,
    ciclo: null,
    categoria: "",
    ods_ids: [],
    estado_publicacion: "BORRADOR",
    url_repositorio: "",
    url_demo_live: "",
    tecnologias: [],
    creado_por: 1
  });
  const [archivoPortada, setArchivoPortada] = useState(null);
  const [archivoVideo, setArchivoVideo] = useState(null);

  const [viewingProyecto, setViewingProyecto] = useState(null);

  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [playingProyecto, setPlayingProyecto] = useState(null);

  const [openModalTech, setOpenModalTech] = useState(false);
  const [editingTech, setEditingTech] = useState(null);
  const [formTechName, setFormTechName] = useState("");

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [formError, setFormError] = useState("");

  const [deleteProyectoModal, setDeleteProyectoModal] = useState({ open: false, id: null, submitting: false });
  const [deleteTechModal, setDeleteTechModal] = useState({ open: false, ids: [], submitting: false });

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

  const handleOpenCreateProyecto = () => {
    setEditingProyecto(null);
    setFormProyecto({
      titulo: "",
      descripcion: "",
      autor_nombre: "",
      carrera: null,
      ciclo: null,
      categoria: "",
      ods_ids: [],
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
    setViewingProyecto(null);
    setEditingProyecto(p);
    setFormProyecto({
      titulo: p.titulo || "",
      descripcion: p.descripcion || "",
      autor_nombre: p.autor_nombre || "",
      carrera: p.carrera || null,
      ciclo: p.ciclo || null,
      categoria: p.categoria || "",
      ods_ids: p.ods_detalle?.map(o => o.id) || [],
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
    if (!formProyecto.titulo.trim() || !formProyecto.autor_nombre.trim() || !formProyecto.carrera) {
      setFormError("El título, autor y carrera son obligatorios.");
      return;
    }
    setFormError("");

    try {
      const formData = new FormData();
      formData.append("titulo", formProyecto.titulo.trim());
      formData.append("descripcion", formProyecto.descripcion.trim());
      formData.append("autor_nombre", formProyecto.autor_nombre.trim());
      if (formProyecto.carrera) formData.append("carrera", formProyecto.carrera);
      if (formProyecto.ciclo) formData.append("ciclo", formProyecto.ciclo);
      formData.append("estado_publicacion", formProyecto.estado_publicacion);
      formData.append("creado_por", formProyecto.creado_por);

      if (formProyecto.categoria) formData.append("categoria", formProyecto.categoria);
      
      if (formProyecto.ods_ids && formProyecto.ods_ids.length > 0) {
        formData.append("ods_ids", JSON.stringify(formProyecto.ods_ids));
      }

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
        showSnackbar("Proyecto digital creado con éxito", "success");
      }
      setOpenModalProyecto(false);
      loadAllData();
    } catch (err) {
      setFormError(err.message || "Error al guardar el proyecto digital.");
    }
  };

  const handleDeleteProyecto = (id) => {
    setDeleteProyectoModal({ open: true, id, submitting: false });
  };

  const handleConfirmDeleteProyecto = async () => {
    setDeleteProyectoModal((prev) => ({ ...prev, submitting: true }));
    try {
      await deleteProyectoSoftware(deleteProyectoModal.id);
      showSnackbar("Proyecto eliminado correctamente", "success");
      if (viewingProyecto && viewingProyecto.id === deleteProyectoModal.id) {
        setViewingProyecto(null);
      }
      loadAllData();
    } catch (err) {
      showSnackbar("Error al eliminar el proyecto", "error");
    } finally {
      setDeleteProyectoModal({ open: false, id: null, submitting: false });
    }
  };

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

  const handleDeleteTech = (id) => {
    setDeleteTechModal({ open: true, ids: [id], submitting: false });
  };

  const handleDeleteMultipleTech = (ids) => {
    setDeleteTechModal({ open: true, ids, submitting: false });
  };

  const handleConfirmDeleteTech = async () => {
    setDeleteTechModal((prev) => ({ ...prev, submitting: true }));
    try {
      await Promise.all(deleteTechModal.ids.map((id) => deleteTecnologia(id)));
      showSnackbar(
        deleteTechModal.ids.length > 1
          ? `${deleteTechModal.ids.length} tecnologías eliminadas`
          : "Tecnología eliminada",
        "success"
      );
      loadAllData();
    } catch (err) {
      showSnackbar("No se pudo eliminar la tecnología", "error");
    } finally {
      setDeleteTechModal({ open: false, ids: [], submitting: false });
    }
  };

  return (
    <Box sx={{ pb: 4, maxWidth: 1360, margin: "0 auto" }}>
      {viewingProyecto ? (
        <ProjectDetailView
          proyecto={viewingProyecto}
          onBack={() => setViewingProyecto(null)}
          onEdit={handleOpenEditProyecto}
          onDelete={handleDeleteProyecto}
        />
      ) : openModalProyecto ? (
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
      ) : (
        <>
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
              <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 500, display: "block", mb: 0.5 }}>
                <Link component={RouterLink} to="/dashboard" color="inherit" underline="hover">Inicio</Link> / Proyectos Digitales
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", mb: 0.5 }}>
                Gestión de Proyectos Digitales
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Administra proyectos digitales, repositorios, videos, tecnologías y ODS.
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              {activeTab === 0 ? (
                <Button
                  variant="contained"
                  startIcon={<PlusIcon />}
                  onClick={handleOpenCreateProyecto}
                  sx={{
                    borderRadius: "2px",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3.5,
                    py: 1,
                    bgcolor: "#002B49",
                    color: "#FFFFFF",
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: "#001e33",
                      boxShadow: "none"
                    }
                  }}
                >
                  Nuevo Proyecto Digital
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<PlusIcon />}
                  onClick={handleOpenCreateTech}
                  sx={{
                    borderRadius: "2px",
                    textTransform: "none",
                    fontWeight: 600,
                    px: 3.5,
                    py: 1,
                    bgcolor: "#002B49",
                    color: "#FFFFFF",
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: "#001e33",
                      boxShadow: "none"
                    }
                  }}
                >
                  Nueva Tecnología
                </Button>
              )}
            </Stack>
          </Box>

          <Box sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.08)", mb: 3.5 }}>
            <Stack direction="row" spacing={4}>
              {[
                { label: `Proyectos Digitales: ${proyectos.length}`, value: 0 },
                { label: `Catálogo de Tecnologías: ${tecnologias.length}`, value: 1 }
              ].map((tab) => {
                const isSelected = activeTab === tab.value;
                return (
                  <Box
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
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

          {activeTab === 0 && (
            <Box>
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

          {activeTab === 1 && (
            <TecnologiasGrid
              tecnologias={tecnologias}
              onEdit={handleOpenEditTech}
              onDelete={handleDeleteTech}
              onDeleteMultiple={handleDeleteMultipleTech}
            />
          )}
        </>
      )}

      <ProyectoDeleteModal
        open={deleteProyectoModal.open}
        onClose={() => setDeleteProyectoModal({ open: false, id: null, submitting: false })}
        onConfirm={handleConfirmDeleteProyecto}
        submitting={deleteProyectoModal.submitting}
      />

      <TecnologiaDeleteModal
        open={deleteTechModal.open}
        onClose={() => setDeleteTechModal({ open: false, ids: [], submitting: false })}
        onConfirm={handleConfirmDeleteTech}
        submitting={deleteTechModal.submitting}
        count={deleteTechModal.ids.length}
      />

      <TecnologiaFormModal
        open={openModalTech}
        onClose={() => setOpenModalTech(false)}
        onSave={handleSaveTech}
        editingTech={editingTech}
        formTechName={formTechName}
        setFormTechName={setFormTechName}
        formError={formError}
      />

      <VideoPlayerModal
        open={openVideoModal}
        onClose={() => setOpenVideoModal(false)}
        proyecto={playingProyecto}
      />

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