import * as React from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  Stack,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Link
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { MagnifyingGlass as SearchIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { FileArrowDown as ExportIcon } from "@phosphor-icons/react/dist/ssr/FileArrowDown";
import { FilePdf as FilePdfIcon } from "@phosphor-icons/react/dist/ssr/FilePdf";
import { FileXls as FileXlsIcon } from "@phosphor-icons/react/dist/ssr/FileXls";

// Librerías para exportación
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  fetchEditores,
  createEditor,
  updateEditor,
  deleteEditor
} from "@/services/api";

import EditoresTable from "./EditoresTable";
import EditorFormModal from "./EditorFormModal";
import EditorDeleteModal from "./EditorDeleteModal";
import EditorDetailView from "./EditorDetailView";

// Helper para formatear fecha
function formatDate(dateString) {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch {
    return "—";
  }
}

// Helper para formatear lista de proyectos
function formatProyectosList(proyectos) {
  if (!proyectos || proyectos.length === 0) return "—";
  return proyectos
    .map((p) => `${p.titulo} (${formatDate(p.fecha)})`)
    .join("; ");
}

export default function EditoresPage() {
  const [editores, setEditores] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [moreFilter, setMoreFilter] = React.useState("ALL");

  const [viewingEditor, setViewingEditor] = React.useState(null);

  const [openDialog, setOpenDialog] = React.useState(false);
  const [editingEditor, setEditingEditor] = React.useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState(null);

  const [formData, setFormData] = React.useState({
    nombre: "",
    email: "",
    password: "",
    is_active: true
  });
  const [formError, setFormError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success"
  });

  const [exportAnchorEl, setExportAnchorEl] = React.useState(null);
  const openExportMenu = Boolean(exportAnchorEl);

  const showSnackbar = React.useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const loadEditores = React.useCallback(async (query = "") => {
    setLoading(true);
    try {
      const data = await fetchEditores(query);
      setEditores(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error("Error al cargar editores:", err);
      showSnackbar(
        "No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [showSnackbar]);

  React.useEffect(() => {
    loadEditores();
  }, [loadEditores]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    const timer = setTimeout(() => {
      loadEditores(val);
    }, 400);
    return () => clearTimeout(timer);
  };

  const handleOpenCreate = () => {
    setEditingEditor(null);
    setFormData({
      nombre: "",
      email: "",
      password: "",
      is_active: true
    });
    setFormError("");
    setOpenDialog(true);
  };

  const handleOpenEdit = (editor) => {
    setEditingEditor(editor);
    setFormData({
      nombre: editor.nombre || "",
      email: editor.email || "",
      password: "",
      is_active: editor.is_active !== undefined ? editor.is_active : true
    });
    setFormError("");
    setOpenDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.email.trim()) {
      setFormError("Nombre y Correo electrónico son obligatorios.");
      return;
    }
    if (!editingEditor && !formData.password.trim()) {
      setFormError("Debes asignar una contraseña para la nueva cuenta.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      if (editingEditor) {
        const payload = {
          nombre: formData.nombre.trim(),
          email: formData.email.trim(),
          is_active: formData.is_active
        };
        if (formData.password.trim()) {
          payload.password = formData.password.trim();
        }
        await updateEditor(editingEditor.id, payload);
        showSnackbar("Editor actualizado correctamente", "success");
      } else {
        await createEditor({
          nombre: formData.nombre.trim(),
          email: formData.email.trim(),
          password: formData.password.trim(),
          is_active: formData.is_active,
          rol: "EDITOR"
        });
        showSnackbar("Nuevo editor creado correctamente", "success");
      }
      setOpenDialog(false);
      loadEditores(searchTerm);
    } catch (err) {
      setFormError(err.message || "Ocurrió un error al guardar.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    setSubmitting(true);
    try {
      await deleteEditor(deletingId);
      showSnackbar("Editor eliminado correctamente", "success");
      setOpenDeleteDialog(false);
      setDeletingId(null);
      loadEditores(searchTerm);
    } catch (err) {
      showSnackbar(err.message || "Error al eliminar el editor", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // ------------------------------------------------------------
  // EXPORTACIONES
  // ------------------------------------------------------------
  const handleExportExcel = () => {
    if (editores.length === 0) {
      showSnackbar("No hay editores para exportar", "warning");
      return;
    }

    const data = editores.map((e) => {
      // Unir todos los proyectos (3D + Software) en una sola columna
      const allProjects = [
        ...(e.proyectos_3d_list || []).map(p => ({ ...p, tipo: "3D" })),
        ...(e.proyectos_software_list || []).map(p => ({ ...p, tipo: "SW" }))
      ];
      // Ordenar por fecha descendente
      allProjects.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      const proyectosStr = allProjects.length > 0
        ? allProjects.map(p => `${p.titulo} (${formatDate(p.fecha)})`).join("; ")
        : "—";

      return {
        Nombre: e.nombre || "",
        Email: e.email || "",
        Rol: "Editor",
        "Fecha creación": formatDate(e.date_joined || e.created_at),
        "Diseños 3D": e.proyectos_3d_count || 0,
        "Proyectos Software": e.proyectos_software_count || 0,
        "Proyectos (todos)": proyectosStr,
        Estado: e.is_active ? "Activo" : "Inactivo"
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Editores");
    XLSX.writeFile(wb, `editores_${new Date().toISOString().slice(0,10)}.xlsx`);

    showSnackbar("Exportación a Excel completada", "success");
    setExportAnchorEl(null);
  };

  const handleExportPDF = () => {
    if (editores.length === 0) {
      showSnackbar("No hay editores para exportar", "warning");
      return;
    }

    const doc = new jsPDF("landscape", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(16);
    doc.text("Lista de Editores", pageWidth / 2, 15, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleString()}`, pageWidth / 2, 22, { align: "center" });

    const rows = editores.map((e) => {
      const allProjects = [
        ...(e.proyectos_3d_list || []).map(p => ({ ...p, tipo: "3D" })),
        ...(e.proyectos_software_list || []).map(p => ({ ...p, tipo: "SW" }))
      ];
      allProjects.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      const proyectosStr = allProjects.length > 0
        ? allProjects.map(p => `${p.titulo} (${formatDate(p.fecha)})`).join("; ")
        : "—";

      return [
        e.nombre || "",
        e.email || "",
        "Editor",
        formatDate(e.date_joined || e.created_at),
        String(e.proyectos_3d_count || 0),
        String(e.proyectos_software_count || 0),
        proyectosStr,
        e.is_active ? "Activo" : "Inactivo"
      ];
    });

    autoTable(doc, {
      startY: 28,
      head: [["Nombre", "Email", "Rol", "Fecha creación", "Diseños 3D", "Proyectos Software", "Proyectos (todos)", "Estado"]],
      body: rows,
      theme: "striped",
      styles: { fontSize: 7, cellPadding: 1.5 },
      headStyles: { fillColor: [0, 43, 73], textColor: 255, fontSize: 8, fontStyle: "bold" },
      columnStyles: {
        6: { cellWidth: 'auto' } // columna de proyectos más ancha
      },
      didDrawPage: (data) => {
        doc.setFontSize(8);
        doc.text(`Página ${data.pageNumber}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 5);
      }
    });

    doc.save(`editores_${new Date().toISOString().slice(0,10)}.pdf`);
    showSnackbar("Exportación a PDF completada", "success");
    setExportAnchorEl(null);
  };

  // ------------------------------------------------------------
  // FILTRADO
  // ------------------------------------------------------------
  const filteredEditores = React.useMemo(() => {
    return editores.filter((e) => {
      if (statusFilter === "ACTIVE" && !e.is_active) return false;
      if (statusFilter === "INACTIVE" && e.is_active) return false;
      const total = (e.proyectos_3d_count || 0) + (e.proyectos_software_count || 0);
      if (moreFilter === "WITH_PROJECTS" && total === 0) return false;
      if (moreFilter === "WITHOUT_PROJECTS" && total > 0) return false;
      return true;
    });
  }, [editores, statusFilter, moreFilter]);

  // ------------------------------------------------------------
  // RENDER
  // ------------------------------------------------------------
  return (
    <Box sx={{ pb: 4, maxWidth: 1360, margin: "0 auto" }}>
      {viewingEditor ? (
        <EditorDetailView
          editor={viewingEditor}
          onBack={() => {
            setViewingEditor(null);
            loadEditores(searchTerm);
          }}
          showSnackbar={showSnackbar}
        />
      ) : (
        <>
          {/* Encabezado */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              gap: 2,
              mb: 2
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary", mb: 0.5 }}>
                Gestión de Editores
              </Typography>
            </Box>

            {/* Botón Exportar con menú */}
            <div>
              <Button
                variant="contained"
                elevation={0}
                startIcon={<ExportIcon size={18} />}
                onClick={(e) => setExportAnchorEl(e.currentTarget)}
                sx={{
                  bgcolor: "#F1F5F9",
                  color: "#1E293B",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "6px",
                  boxShadow: "none",
                  px: 2.2,
                  py: 0.8,
                  "&:hover": { bgcolor: "#E2E8F0", boxShadow: "none" }
                }}
              >
                Exportar
              </Button>
              <Menu
                anchorEl={exportAnchorEl}
                open={openExportMenu}
                onClose={() => setExportAnchorEl(null)}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    borderRadius: "6px",
                    border: "1px solid rgba(0, 0, 0, 0.06)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    minWidth: 200,
                    py: 0.5,
                    mt: 0.5
                  }
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleExportExcel} sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
                  <FileXlsIcon size={18} style={{ marginRight: 8 }} />
                  Exportar a Excel
                </MenuItem>
                <MenuItem onClick={handleExportPDF} sx={{ fontSize: "0.85rem", fontWeight: 500 }}>
                  <FilePdfIcon size={18} style={{ marginRight: 8 }} />
                  Exportar a PDF
                </MenuItem>
              </Menu>
            </div>
          </Box>

          <Box sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.06)", mb: 3 }} />

          {/* Barra de Acciones y Filtros */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", md: "center" },
              gap: 2,
              mb: 3
            }}
          >
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center">
              <Button
                variant="contained"
                startIcon={<PlusIcon weight="bold" />}
                onClick={handleOpenCreate}
                elevation={0}
                sx={{
                  bgcolor: "#002B49",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "2px",
                  boxShadow: "none",
                  px: 3.5,
                  py: 1,
                  whiteSpace: "nowrap",
                  "&:hover": { bgcolor: "#001e33", boxShadow: "none" }
                }}
              >
                Nuevo Editor
              </Button>
              <TextField
                placeholder="Buscar editor..."
                label="Buscar"
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
                sx={{
                  width: { xs: "100%", sm: 280 },
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#FFFFFF",
                    borderRadius: "2px",
                    "& fieldset": { borderColor: "rgba(0, 0, 0, 0.23)" },
                    "&:hover fieldset": { borderColor: "rgba(0, 0, 0, 0.4)" },
                    "&.Mui-focused fieldset": { borderColor: "#002B49" }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon size={18} color="#64748B" />
                    </InputAdornment>
                  )
                }}
              />
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={statusFilter}
                  label="Estado"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="ALL">Todos los estados</MenuItem>
                  <MenuItem value="ACTIVE">Activo</MenuItem>
                  <MenuItem value="INACTIVE">Inactivo</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Filtro Proyectos</InputLabel>
                <Select
                  value={moreFilter}
                  label="Filtro Proyectos"
                  onChange={(e) => setMoreFilter(e.target.value)}
                >
                  <MenuItem value="ALL">Todos los editores</MenuItem>
                  <MenuItem value="WITH_PROJECTS">Con proyectos subidos</MenuItem>
                  <MenuItem value="WITHOUT_PROJECTS">Sin proyectos subidos</MenuItem>
                </Select>
              </FormControl>

              {(searchTerm || statusFilter !== "ALL" || moreFilter !== "ALL") && (
                <Button
                  size="small"
                  variant="outlined"
                  color="inherit"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("ALL");
                    setMoreFilter("ALL");
                  }}
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
              )}
            </Stack>
          </Box>

          {/* Tabla */}
          <EditoresTable
            editores={filteredEditores}
            loading={loading}
            searchTerm={searchTerm}
            onViewProjects={(editor) => setViewingEditor(editor)}
            onEdit={(editor) => handleOpenEdit(editor)}
            onDelete={(editor) => {
              setDeletingId(editor.id);
              setOpenDeleteDialog(true);
            }}
            onOpenCreate={handleOpenCreate}
          />
        </>
      )}

      {/* Modales */}
      <EditorFormModal
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        editingEditor={editingEditor}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        formError={formError}
        submitting={submitting}
      />

      <EditorDeleteModal
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        submitting={submitting}
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
          sx={{
            width: "100%",
            borderRadius: 1.5,
            boxShadow: "0px 4px 20px rgba(0,0,0,0.12)"
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}