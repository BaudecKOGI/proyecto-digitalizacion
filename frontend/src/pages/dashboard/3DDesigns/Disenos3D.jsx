import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Stack,
  Snackbar,
  Alert
} from "@mui/material";

import {
  fetchProyectos3DAdmin,
  createProyecto3D,
  updateProyecto3D,
  deleteProyecto3D,
  fetchCategorias
} from "@/services/api";

import Disenos3DTable from "./Disenos3DTable";
import Diseno3DFormView from "./FormView";
import Diseno3DDetailView from "./Diseno3DDetailView";
import Diseno3DDeleteModal from "./Diseno3DDeleteModal";
import GenerarInvitacionDialog from "@/components/core/GenerarInvitacionDialog";

import Disenos3DHeader from "./components/Disenos3DHeader";
import Disenos3DFilters from "./components/Disenos3DFilters";

export default function Disenos3D() {
  const [disenos, setDisenos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pestañas: "3d" (todos) o "invitaciones"
  const [tabValue, setTabValue] = useState("3d");

  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [selectedOds, setSelectedOds] = useState("");
  const [filterEstado, setFilterEstado] = useState("");

  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("disenos3d_viewMode") || "table";
  });

  const [activeView, setActiveView] = useState("list");

  const [selectedDiseno, setSelectedDiseno] = useState(null);
  const [editingDiseno, setEditingDiseno] = useState(null);

  const [formDiseno, setFormDiseno] = useState({
    titulo: "",
    estado_publicacion: "BORRADOR",
    autor_nombre: "",
    carrera: null,
    ciclo: null,
    categoria: "",
    ods_ids: [],
    descripcion: ""
  });
  const [archivoFBX, setArchivoFBX] = useState(null);
  const [imagenMiniatura, setImagenMiniatura] = useState(null);
  const [formError, setFormError] = useState("");

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null, submitting: false });
  const [openInvitacionDialog, setOpenInvitacionDialog] = useState(false);

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

  const filteredDisenos = useMemo(() => {
    let list = disenos;
    if (tabValue === "invitaciones") {
      list = list.filter(item => item.invitacion !== null);
    }
    if (filterEstado) {
      list = list.filter(item => item.estado_publicacion === filterEstado);
    }
    if (!searchTerm.trim()) return list;
    const query = searchTerm.toLowerCase().trim();
    return list.filter(item => {
      const titulo = (item.titulo || "").toLowerCase();
      const autor = (item.autor_nombre || "").toLowerCase();
      const desc = (item.descripcion || "").toLowerCase();
      const carrera = (item.carrera_nombre || "").toLowerCase();
      return (
        titulo.includes(query) ||
        autor.includes(query) ||
        desc.includes(query) ||
        carrera.includes(query)
      );
    });
  }, [disenos, tabValue, filterEstado, searchTerm]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategoria("");
    setSelectedOds("");
    setFilterEstado("");
    setTabValue("3d");
  };

  const handleUpdateEstado = async (id, nuevoEstado) => {
    try {
      const formData = new FormData();
      formData.append("estado_publicacion", nuevoEstado);
      await updateProyecto3D(id, formData);
      setDisenos(prev => prev.map(p => p.id === id ? { ...p, estado_publicacion: nuevoEstado } : p));
      setSnackbar({ open: true, message: "Estado actualizado exitosamente.", severity: "success" });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.message || "Error al actualizar estado.", severity: "error" });
    }
  };

  const handleOpenCreate = () => {
    setEditingDiseno(null);
    setFormDiseno({
      titulo: "",
      estado_publicacion: "BORRADOR",
      autor_nombre: "",
      carrera: null,
      ciclo: null,
      categoria: "",
      ods_ids: [],
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
      carrera: item.carrera || null,
      ciclo: item.ciclo || null,
      categoria: typeof item.categoria === "object" ? item.categoria?.id || "" : item.categoria || "",
      ods_ids: item.ods_detalle?.map(o => o.id) || [],
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
      if (formDiseno.carrera) formData.append("carrera", formDiseno.carrera);
      if (formDiseno.ciclo) formData.append("ciclo", formDiseno.ciclo);
      formData.append("descripcion", formDiseno.descripcion);
      formData.append("creado_por", formDiseno.creado_por || 1);

      if (formDiseno.categoria) {
        formData.append("categoria", formDiseno.categoria);
      } else if (categorias.length > 0) {
        formData.append("categoria", categorias[0].id);
      }
      
      if (formDiseno.ods_ids && formDiseno.ods_ids.length > 0) {
        formData.append("ods_ids", JSON.stringify(formDiseno.ods_ids));
      }

      if (archivoFBX) formData.append("archivo_fbx", archivoFBX);
      if (imagenMiniatura) formData.append("imagen_miniatura", imagenMiniatura);
      
      if (piezasMoviles && Array.isArray(piezasMoviles)) {
        const configuracionJSON = JSON.stringify({ piezas_moviles: piezasMoviles });
        formData.append("configuracion_interactiva", configuracionJSON);
      }

      if (editingDiseno) {
        await updateProyecto3D(editingDiseno.id, formData);
        setSnackbar({ open: true, message: "Modelo 3D actualizado exitosamente.", severity: "success" });
        if (selectedDiseno && selectedDiseno.id === editingDiseno.id) {
          setSelectedDiseno({
            ...selectedDiseno,
            ...formDiseno,
            categoria: categorias.find((c) => c.id === Number(formDiseno.categoria)) || formDiseno.categoria
          });
        }
      } else {
        await createProyecto3D(formData);
        setSnackbar({ open: true, message: "Nuevo Modelo 3D creado con éxito.", severity: "success" });
      }

      setActiveView("list");
      loadData();
    } catch (err) {
      console.error("Error guardando proyecto 3D:", err);
      setFormError(err.message || "Error en el servidor al intentar guardar.");
    }
  };

  const handleDeleteDiseno = (item) => setDeleteModal({ open: true, item, submitting: false });

  const handleConfirmDelete = async () => {
    const item = deleteModal.item;
    if (!item) return;
    setDeleteModal((prev) => ({ ...prev, submitting: true }));
    try {
      await deleteProyecto3D(item.id);
      setSnackbar({ open: true, message: `Modelo 3D "${item.titulo}" eliminado correctamente.`, severity: "success" });
      if (selectedDiseno && selectedDiseno.id === item.id) setSelectedDiseno(null);
      loadData();
    } catch (err) {
      console.error("Error eliminando modelo 3D:", err);
      setSnackbar({ open: true, message: err.message || "No se pudo eliminar el modelo 3D.", severity: "error" });
    } finally {
      setDeleteModal({ open: false, item: null, submitting: false });
    }
  };

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

  const totalCount = disenos.length;
  const invitacionesCount = disenos.filter((d) => d.invitacion !== null).length;

  return (
    <Box sx={{ pb: 4, maxWidth: 1360, margin: "0 auto" }}>
      <Disenos3DHeader
        handleOpenCreate={handleOpenCreate}
        setOpenInvitacionDialog={setOpenInvitacionDialog}
      />

      <Box sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.08)", mb: 3.5 }}>
        <Stack direction="row" spacing={4}>
          {[
            { label: `Modelos 3D: ${totalCount}`, value: "3d" },
            { label: `Invitaciones: ${invitacionesCount}`, value: "invitaciones" }
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
                  "&:hover": { color: "#111827" },
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
                    } : {}
                }}
              >
                {tab.label}
              </Box>
            );
          })}
        </Stack>
      </Box>

      <Disenos3DFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterEstado={filterEstado}
        setFilterEstado={setFilterEstado}
        selectedCategoria={selectedCategoria}
        setSelectedCategoria={setSelectedCategoria}
        categorias={categorias}
        selectedOds={selectedOds}
        setSelectedOds={setSelectedOds}
        tabValue={tabValue}
        handleClearFilters={handleClearFilters}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <Disenos3DTable
        disenos={filteredDisenos}
        categorias={categorias}
        loading={loading}
        viewMode={viewMode}
        onView={(item) => setSelectedDiseno(item)}
        onEdit={(item) => handleOpenEdit(item)}
        onDelete={(item) => handleDeleteDiseno(item)}
        onUpdateEstado={handleUpdateEstado}
      />

      <Diseno3DDeleteModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null, submitting: false })}
        onConfirm={handleConfirmDelete}
        submitting={deleteModal.submitting}
      />

      <GenerarInvitacionDialog
        open={openInvitacionDialog}
        onClose={() => setOpenInvitacionDialog(false)}
        onSuccess={() => {
          setOpenInvitacionDialog(false);
          loadData();
        }}
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
          sx={{ width: "100%", borderRadius: 2, fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}