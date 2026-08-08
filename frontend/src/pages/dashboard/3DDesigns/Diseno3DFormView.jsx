import * as React from "react";
import { useState, useEffect, Suspense, useRef } from "react";
import {
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Button,
  Alert,
  Typography,
  Paper,
  Stack,
  Divider,
  Checkbox,
  FormControlLabel,
  IconButton,
  Chip
} from "@mui/material";
import { ArrowLeft as BackIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { Plus, Trash2, Upload, Eye, FileEdit, Box as BoxIcon } from "lucide-react";
import { ODS_LIST } from "@/pages/dashboard/digitalProjects/odsData";
import ConfirmDialog from "@/components/core/ConfirmDialog";

// IMPORTAR SERVICIO DE CARRERAS
import { fetchCarreras } from "@/services/api";

// IMPORTACIONES 3D
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useFBX, Html } from "@react-three/drei";

// COMPONENTE INTERNO: MODELO FBX + INTERACCIÓN
const FBXModel = ({ url, piezasMoviles, setHabilitarCamara }) => {
  const fbx = useFBX(url);
  const originalRotations = useRef({});
  const dragRef = useRef(null);

  useEffect(() => {
    if (!fbx) return;
    fbx.traverse((child) => {
      if (!originalRotations.current[child.uuid]) {
        originalRotations.current[child.uuid] = {
          x: child.rotation.x,
          y: child.rotation.y,
          z: child.rotation.z
        };
      }
    });
  }, [fbx]);

  useEffect(() => {
    const handleWindowPointerMove = (e) => {
      if (!dragRef.current) return;

      const { mesh, config, lastX, lastY } = dragRef.current;
      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;

      const sensiblidad = config.invertir_giro ? -0.01 : 0.01;
      const cambioRotacion = (deltaX + deltaY) * sensiblidad;

      const baseRot = originalRotations.current[mesh.uuid]?.[config.eje] || 0;
      const minRad = baseRot + (config.min_giro * Math.PI) / 180;
      const maxRad = baseRot + (config.max_giro * Math.PI) / 180;

      const rotActual = mesh.rotation[config.eje];
      const nuevaRotacion = Math.max(minRad, Math.min(maxRad, rotActual + cambioRotacion));

      mesh.rotation[config.eje] = nuevaRotacion;

      dragRef.current.lastX = e.clientX;
      dragRef.current.lastY = e.clientY;
    };

    const handleWindowPointerUp = () => {
      if (dragRef.current) {
        dragRef.current = null;
        setHabilitarCamara(true);
        document.body.style.cursor = "auto";
      }
    };

    window.addEventListener("pointermove", handleWindowPointerMove);
    window.addEventListener("pointerup", handleWindowPointerUp);

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
    };
  }, [setHabilitarCamara]);

  const encontrarConfiguracionDePieza = (objetoTocado) => {
    let nodoActual = objetoTocado;
    while (nodoActual) {
      const nombreNodo = nodoActual.name ? nodoActual.name.trim().toLowerCase() : "";
      const piezaConfig = (piezasMoviles || []).find(
        (p) => p.nombre_objeto && p.nombre_objeto.trim().toLowerCase() === nombreNodo
      );
      if (piezaConfig) {
        return { config: piezaConfig, mesh: nodoActual };
      }
      nodoActual = nodoActual.parent;
    }
    return null;
  };

  const onPointerDown = (e) => {
    const resultado = encontrarConfiguracionDePieza(e.object);
    if (resultado) {
      e.stopPropagation();
      setHabilitarCamara(false);
      dragRef.current = {
        mesh: resultado.mesh,
        config: resultado.config,
        lastX: e.clientX,
        lastY: e.clientY
      };
      document.body.style.cursor = "grabbing";
    }
  };

  const onPointerOver = (e) => {
    const resultado = encontrarConfiguracionDePieza(e.object);
    if (resultado) {
      e.stopPropagation();
      document.body.style.cursor = "grab";
    }
  };

  const onPointerOut = () => {
    if (!dragRef.current) document.body.style.cursor = "auto";
  };

  return (
    <primitive
      object={fbx}
      scale={0.01}
      onPointerDown={onPointerDown}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    />
  );
};

// FORMULARIO PRINCIPAL
export default function Diseno3DFormView({
  onBack,
  onSave,
  editingDiseno,
  formDiseno,
  setFormDiseno,
  archivoFBX,
  setArchivoFBX,
  imagenMiniatura,
  setImagenMiniatura,
  categorias,
  formError
}) {
  const [fbxUrl, setFbxUrl] = useState(null);
  const [piezasMoviles, setPiezasMoviles] = useState([]);
  const [habilitarCamara, setHabilitarCamara] = useState(true);

  // ESTADOS PARA CARRERAS
  const [carreras, setCarreras] = useState([]);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState(null);
  const [cicloSeleccionado, setCicloSeleccionado] = useState(null);

  // ESTADO PARA CONFIRMAR CANCELACIÓN
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [initialFormState, setInitialFormState] = useState(null);
  const [initialPiezasState, setInitialPiezasState] = useState(null);

  // Cargar carreras al montar
  useEffect(() => {
    const loadCarreras = async () => {
      try {
        const data = await fetchCarreras("activo=true");
        setCarreras(Array.isArray(data) ? data : data.results || []);
      } catch (error) {
        console.error("Error cargando carreras:", error);
        setCarreras([]);
      }
    };
    loadCarreras();
  }, []);

  // Preseleccionar carrera y ciclo si estamos editando
  useEffect(() => {
    if (editingDiseno) {
      if (editingDiseno.carrera) {
        const found = carreras.find(c => c.id === editingDiseno.carrera);
        if (found) {
          setCarreraSeleccionada(found.id);
          if (editingDiseno.ciclo) {
            setCicloSeleccionado(editingDiseno.ciclo);
          }
        }
      }
    }
  }, [editingDiseno, carreras]);

  // Sincronizar formDiseno cuando cambian carrera o ciclo
  useEffect(() => {
    if (carreraSeleccionada !== undefined) {
      setFormDiseno(prev => ({ ...prev, carrera: carreraSeleccionada }));
    }
  }, [carreraSeleccionada, setFormDiseno]);

  useEffect(() => {
    if (cicloSeleccionado !== undefined) {
      setFormDiseno(prev => ({ ...prev, ciclo: cicloSeleccionado }));
    }
  }, [cicloSeleccionado, setFormDiseno]);

  const carreraActual = carreras.find(c => c.id === carreraSeleccionada);
  const duracionCiclos = carreraActual ? carreraActual.duracion_ciclos : 0;

  const generarOpcionesCiclos = (total) => {
    const romanos = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    return Array.from({ length: total }, (_, i) => ({
      value: i + 1,
      label: romanos[i] || (i + 1).toString()
    }));
  };

  const opcionesCiclos = generarOpcionesCiclos(duracionCiclos);

  useEffect(() => {
    if (!initialFormState && formDiseno) {
      setInitialFormState(JSON.stringify(formDiseno));
    }
  }, [formDiseno, initialFormState]);

  useEffect(() => {
    if (!initialPiezasState && piezasMoviles.length > 0) {
      setInitialPiezasState(JSON.stringify(piezasMoviles));
    } else if (!initialPiezasState && editingDiseno) {
      setInitialPiezasState("[]");
    }
  }, [piezasMoviles, initialPiezasState, editingDiseno]);

  const hasUnsavedChanges = () => {
    const currentFormState = JSON.stringify(formDiseno);
    const currentPiezasState = JSON.stringify(piezasMoviles);
    const basePiezas = initialPiezasState || "[]";
    const baseForm = initialFormState || "{}";

    if (currentFormState !== baseForm) return true;
    if (currentPiezasState !== basePiezas) return true;
    if (archivoFBX) return true;
    if (imagenMiniatura) return true;

    return false;
  };

  const handleCancelClick = () => {
    if (hasUnsavedChanges()) {
      setShowCancelDialog(true);
    } else {
      onBack();
    }
  };

  useEffect(() => {
    if (archivoFBX) {
      const url = URL.createObjectURL(archivoFBX);
      setFbxUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (editingDiseno && editingDiseno.archivo_fbx) {
      setFbxUrl(editingDiseno.archivo_fbx);
    } else {
      setFbxUrl(null);
    }
  }, [archivoFBX, editingDiseno]);

  useEffect(() => {
    if (editingDiseno && editingDiseno.configuracion_interactiva) {
      let config = editingDiseno.configuracion_interactiva;
      if (typeof config === "string") {
        try {
          config = JSON.parse(config);
        } catch (e) {
          config = {};
        }
      }
      if (config && Array.isArray(config.piezas_moviles)) {
        setPiezasMoviles(config.piezas_moviles);
      } else {
        setPiezasMoviles([]);
      }
    } else {
      setPiezasMoviles([]);
    }
  }, [editingDiseno]);

  const agregarPieza = () => {
    setPiezasMoviles([
      ...piezasMoviles,
      {
        nombre_objeto: "",
        eje: "x",
        etiqueta: "",
        min_giro: -180,
        max_giro: 180,
        invertir_giro: false
      }
    ]);
  };

  const actualizarPieza = (index, campo, valor) => {
    const nuevasPiezas = [...piezasMoviles];
    nuevasPiezas[index][campo] = valor;
    setPiezasMoviles(nuevasPiezas);
  };

  const eliminarPieza = (index) => {
    setPiezasMoviles(piezasMoviles.filter((_, i) => i !== index));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    onSave(e, piezasMoviles);
  };

  // ESTILOS
  const fieldSx = {
    bgcolor: "#F8FAFC",
    borderRadius: "2px 2px 0 0",
    "& .MuiOutlinedInput-root": {
      bgcolor: "#F8FAFC",
      borderRadius: "2px 2px 0 0",
      "& fieldset": {
        border: "none",
        borderBottom: "1px solid #002B49"
      },
      "&:hover fieldset": {
        border: "none",
        borderBottom: "1.5px solid #002B49"
      },
      "&.Mui-focused fieldset": {
        border: "none",
        borderBottom: "2px solid #002B49"
      }
    },
    "& .MuiInputBase-input": {
      py: 1.2,
      px: 1.5,
      fontSize: "0.95rem",
      color: "#0F172A",
      fontWeight: 500
    }
  };

  const selectSx = {
    bgcolor: "#F8FAFC",
    borderRadius: "2px 2px 0 0",
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
      borderBottom: "1px solid #002B49"
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: "none",
      borderBottom: "1.5px solid #002B49"
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "none",
      borderBottom: "2px solid #002B49"
    },
    "& .MuiSelect-select": {
      py: 1.2,
      px: 1.5,
      fontSize: "0.95rem",
      color: "#0F172A",
      fontWeight: 500
    }
  };

  const labelSx = {
    fontWeight: 600,
    color: "#1E293B",
    mb: 0.6,
    fontSize: "0.85rem"
  };

  return (
    <Box sx={{ width: "100%", pb: 6 }}>
      {/* 1. BARRA SUPERIOR DE NAVEGACIÓN */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          pb: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          flexWrap: "wrap",
          gap: 2
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            variant="outlined"
            onClick={onBack}
            startIcon={<BackIcon size={18} />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "2px",
              borderColor: "#002B49",
              color: "#002B49",
              "&:hover": {
                bgcolor: "rgba(0, 43, 73, 0.04)",
                borderColor: "#002B49"
              }
            }}
          >
            Volver a Modelos
          </Button>
          <Typography variant="h6" fontWeight={700} sx={{ color: "text.primary" }}>
            {editingDiseno ? "Editar Modelo 3D" : "Crear Modelo 3D"}
          </Typography>
        </Stack>
      </Box>

      {formError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "2px" }}>
          {formError}
        </Alert>
      )}

      {/* 2. LAYOUT A DOS COLUMNAS */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
          gap: 4,
          alignItems: "flex-start"
        }}
      >
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <Paper
          elevation={0}
          component="form"
          id="diseno3d-form"
          onSubmit={handleSubmitForm}
          sx={{
            flex: { xs: "1 1 100%", lg: "0 0 46%" },
            width: "100%",
            p: { xs: 2.5, sm: 4 },
            borderRadius: "6px",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
            bgcolor: "#FFFFFF"
          }}
        >
          <Typography variant="h5" fontWeight={800} gutterBottom sx={{ color: "text.primary", mb: 0.5 }}>
            {editingDiseno ? "Editar Modelo 3D" : "Crear Nuevo Modelo 3D"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Completa la información general, carga el modelo 3D y configura las interacciones mecánicas del proyecto.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={3.5}>
            {/* ESTADO DE PUBLICACIÓN */}
            <Box>
              <Typography variant="body2" sx={labelSx}>
                Estado de Publicación
              </Typography>
              <Stack direction="row" spacing={1.5}>
                <Button
                  fullWidth
                  variant={formDiseno.estado_publicacion === "PUBLICADO" ? "contained" : "outlined"}
                  onClick={() => setFormDiseno({ ...formDiseno, estado_publicacion: "PUBLICADO" })}
                  startIcon={<Eye size={18} />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "2px",
                    borderColor: "#002B49",
                    ...(formDiseno.estado_publicacion === "PUBLICADO"
                      ? { bgcolor: "#002B49", color: "#fff", "&:hover": { bgcolor: "#001e33" } }
                      : { color: "#002B49", "&:hover": { bgcolor: "rgba(0,43,73,0.04)" } })
                  }}
                >
                  Público
                </Button>
                <Button
                  fullWidth
                  variant={formDiseno.estado_publicacion === "BORRADOR" ? "contained" : "outlined"}
                  onClick={() => setFormDiseno({ ...formDiseno, estado_publicacion: "BORRADOR" })}
                  startIcon={<FileEdit size={18} />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "2px",
                    borderColor: "#002B49",
                    ...(formDiseno.estado_publicacion === "BORRADOR"
                      ? { bgcolor: "#002B49", color: "#fff", "&:hover": { bgcolor: "#001e33" } }
                      : { color: "#002B49", "&:hover": { bgcolor: "rgba(0,43,73,0.04)" } })
                  }}
                >
                  Borrador
                </Button>
              </Stack>
            </Box>

            {/* TÍTULO */}
            <Box>
              <Typography variant="body2" sx={labelSx}>
                Título del Proyecto
              </Typography>
              <TextField
                fullWidth
                required
                placeholder="Ej. Brazo Robótico Articulado"
                value={formDiseno.titulo || ""}
                onChange={(e) => setFormDiseno({ ...formDiseno, titulo: e.target.value })}
                sx={fieldSx}
              />
            </Box>

            {/* AUTOR + CARRERA + CICLO (ahora Selects) */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2.5}>
              <Box sx={{ flex: 2 }}>
                <Typography variant="body2" sx={labelSx}>
                  Autor(es)
                </Typography>
                <TextField
                  fullWidth
                  required
                  placeholder="Ej. Alessandro"
                  value={formDiseno.autor_nombre || ""}
                  onChange={(e) => setFormDiseno({ ...formDiseno, autor_nombre: e.target.value })}
                  sx={fieldSx}
                />
              </Box>
              <Box sx={{ flex: 2 }}>
                <Typography variant="body2" sx={labelSx}>
                  Carrera
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={carreraSeleccionada || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCarreraSeleccionada(val);
                      setCicloSeleccionado(null);
                    }}
                    displayEmpty
                    sx={selectSx}
                  >
                    <MenuItem value="">
                      <em>Seleccionar...</em>
                    </MenuItem>
                    {carreras.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {c.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={labelSx}>
                  Ciclo
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={cicloSeleccionado || ""}
                    onChange={(e) => setCicloSeleccionado(e.target.value)}
                    disabled={!carreraSeleccionada}
                    displayEmpty
                    sx={selectSx}
                  >
                    <MenuItem value="">
                      <em>{carreraSeleccionada ? "Seleccionar..." : "Primero selecciona carrera"}</em>
                    </MenuItem>
                    {opcionesCiclos.map((op) => (
                      <MenuItem key={op.value} value={op.value}>
                        {op.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Stack>

            {/* CATEGORÍA + ODS (múltiple) */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2.5}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={labelSx}>
                  Categoría
                </Typography>
                <FormControl fullWidth>
                  <Select
                    value={formDiseno.categoria || ""}
                    onChange={(e) => setFormDiseno({ ...formDiseno, categoria: e.target.value })}
                    displayEmpty
                    sx={selectSx}
                  >
                    <MenuItem value="">
                      <em>Seleccionar...</em>
                    </MenuItem>
                    {categorias.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={labelSx}>
                  ODS de Impacto (ONU)
                </Typography>
                <FormControl fullWidth>
                  <Select
                    multiple
                    value={formDiseno.ods_ids || []}
                    onChange={(e) => setFormDiseno({ ...formDiseno, ods_ids: e.target.value })}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((id) => {
                          const ods = ODS_LIST.find(o => o.id === id);
                          return (
                            <Chip
                              key={id}
                              label={ods ? `ODS ${id}` : id}
                              size="small"
                              sx={{ bgcolor: '#E2E8F0', color: '#475569', fontWeight: 600 }}
                            />
                          );
                        })}
                      </Box>
                    )}
                    sx={selectSx}
                  >
                    {ODS_LIST.map((o) => (
                      <MenuItem key={o.id} value={o.id}>
                        {o.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Stack>

            {/* DESCRIPCIÓN */}
            <Box>
              <Typography variant="body2" sx={labelSx}>
                Descripción
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                required
                placeholder="Descripción del modelo 3D..."
                value={formDiseno.descripcion || ""}
                onChange={(e) => setFormDiseno({ ...formDiseno, descripcion: e.target.value })}
                sx={fieldSx}
              />
            </Box>

            {/* ARCHIVOS */}
            <Box>
              <Typography variant="body2" sx={{ ...labelSx, mb: 1.5 }}>
                Archivos
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<Upload size={18} />}
                  sx={{
                    py: 1.8,
                    borderRadius: "2px",
                    textTransform: "none",
                    fontWeight: 600,
                    borderColor: "#002B49",
                    color: "#002B49",
                    borderStyle: "dashed",
                    "&:hover": { bgcolor: "rgba(0,43,73,0.04)", borderColor: "#002B49" }
                  }}
                >
                  {archivoFBX
                    ? archivoFBX.name
                    : editingDiseno
                      ? "Actualizar .FBX"
                      : "Subir Modelo .FBX"}
                  <input
                    type="file"
                    hidden
                    accept=".fbx,.obj,.glb,.gltf"
                    onChange={(e) => setArchivoFBX(e.target.files?.[0] || null)}
                  />
                </Button>

                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  startIcon={<Upload size={18} />}
                  sx={{
                    py: 1.8,
                    borderRadius: "2px",
                    textTransform: "none",
                    fontWeight: 600,
                    borderColor: "#002B49",
                    color: "#002B49",
                    borderStyle: "dashed",
                    "&:hover": { bgcolor: "rgba(0,43,73,0.04)", borderColor: "#002B49" }
                  }}
                >
                  {imagenMiniatura
                    ? imagenMiniatura.name
                    : editingDiseno
                      ? "Actualizar Miniatura"
                      : "Subir Portada"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => setImagenMiniatura(e.target.files?.[0] || null)}
                  />
                </Button>
              </Stack>
            </Box>

            {/* CONTROLES MECÁNICOS */}
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="body2" sx={labelSx}>
                  Controles Mecánicos
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Plus size={14} />}
                  onClick={agregarPieza}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "2px",
                    borderColor: "#002B49",
                    color: "#002B49",
                    "&:hover": { bgcolor: "rgba(0,43,73,0.04)" }
                  }}
                >
                  Nueva Pieza
                </Button>
              </Stack>

              {piezasMoviles.length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    p: 3,
                    bgcolor: "#F8FAFC",
                    borderRadius: "4px",
                    border: "1px dashed",
                    borderColor: "divider"
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No has agregado piezas móviles. Presiona "Nueva Pieza" para configurar la interacción.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {piezasMoviles.map((pieza, index) => (
                    <Paper
                      key={index}
                      elevation={0}
                      sx={{
                        p: 2.5,
                        bgcolor: "#F8FAFC",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: "4px",
                        position: "relative"
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => eliminarPieza(index)}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: "error.main",
                          bgcolor: "error.lighter",
                          "&:hover": { bgcolor: "error.light" }
                        }}
                      >
                        <Trash2 size={14} />
                      </IconButton>

                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2, pr: 4 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ ...labelSx, fontSize: "0.75rem" }}>
                            ID de la pieza (FBX)
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            required
                            placeholder="Ej: Rueda_Izq"
                            value={pieza.nombre_objeto}
                            onChange={(e) => actualizarPieza(index, "nombre_objeto", e.target.value)}
                            sx={fieldSx}
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ ...labelSx, fontSize: "0.75rem" }}>
                            Etiqueta (UI)
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            required
                            placeholder="Ej: Girar Rueda"
                            value={pieza.etiqueta}
                            onChange={(e) => actualizarPieza(index, "etiqueta", e.target.value)}
                            sx={fieldSx}
                          />
                        </Box>
                      </Stack>

                      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="flex-end">
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ ...labelSx, fontSize: "0.75rem" }}>
                            Eje
                          </Typography>
                          <FormControl fullWidth size="small">
                            <Select
                              value={pieza.eje}
                              onChange={(e) => actualizarPieza(index, "eje", e.target.value)}
                              sx={selectSx}
                            >
                              <MenuItem value="x">Eje X</MenuItem>
                              <MenuItem value="y">Eje Y</MenuItem>
                              <MenuItem value="z">Eje Z</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ ...labelSx, fontSize: "0.75rem" }}>
                            Límite Min (°)
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            type="number"
                            required
                            value={pieza.min_giro}
                            onChange={(e) => actualizarPieza(index, "min_giro", Number(e.target.value))}
                            sx={fieldSx}
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" sx={{ ...labelSx, fontSize: "0.75rem" }}>
                            Límite Max (°)
                          </Typography>
                          <TextField
                            fullWidth
                            size="small"
                            type="number"
                            required
                            value={pieza.max_giro}
                            onChange={(e) => actualizarPieza(index, "max_giro", Number(e.target.value))}
                            sx={fieldSx}
                          />
                        </Box>
                        <Box sx={{ flex: 1, pb: 0.5 }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={pieza.invertir_giro || false}
                                onChange={(e) => actualizarPieza(index, "invertir_giro", e.target.checked)}
                                sx={{ color: "#002B49", "&.Mui-checked": { color: "#002B49" } }}
                              />
                            }
                            label={
                              <Typography variant="caption" fontWeight={600}>
                                Invertir Giro
                              </Typography>
                            }
                          />
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Box>
          </Stack>

          <Divider sx={{ my: 4 }} />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              type="button"
              variant="outlined"
              onClick={handleCancelClick}
              sx={{
                borderRadius: "2px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                color: "#002B49",
                borderColor: "#002B49",
                px: 3.5,
                py: 0.9,
                "&:hover": { borderColor: "#002B49", bgcolor: "rgba(0, 43, 73, 0.04)" }
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "2px",
                px: 4,
                py: 0.9,
                bgcolor: "#002B49",
                color: "#FFFFFF",
                boxShadow: "none",
                "&:hover": { bgcolor: "#001e33", boxShadow: "none" }
              }}
            >
              {editingDiseno ? "Actualizar Proyecto" : "Crear Modelo 3D"}
            </Button>
          </Stack>
        </Paper>

        {/* COLUMNA DERECHA: VISOR 3D */}
        <Box
          sx={{
            flex: { xs: "1 1 100%", lg: "1 1 auto" },
            width: { xs: "100%", lg: "auto" },
            minWidth: { lg: 420 },
            height: { xs: 480, lg: "calc(100vh - 80px)" },
            position: { lg: "sticky" },
            top: { lg: 24 },
            bgcolor: "#1e293b",
            borderRadius: "6px",
            border: "1px solid #334155",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {!fbxUrl ? (
            <Box sx={{ textAlign: "center", color: "#94a3b8", p: 3 }}>
              <BoxIcon size={64} style={{ opacity: 0.3, marginBottom: 16 }} />
              <Typography variant="body2" fontWeight={500}>
                Sube tu archivo .FBX a la izquierda
                <br />
                para previsualizarlo aquí
              </Typography>
            </Box>
          ) : (
            <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }} style={{ width: "100%", height: "100%" }}>
              <color attach="background" args={["#1e293b"]} />
              <Suspense
                fallback={
                  <Html center>
                    <Typography sx={{ color: "#22d3ee", fontWeight: 700, fontSize: 14 }}>
                      Cargando modelo 3D...
                    </Typography>
                  </Html>
                }
              >
                <Stage environment="city" intensity={0.6}>
                  <FBXModel
                    url={fbxUrl}
                    piezasMoviles={piezasMoviles}
                    setHabilitarCamara={setHabilitarCamara}
                  />
                </Stage>
              </Suspense>
              <OrbitControls makeDefault enabled={habilitarCamara} />
            </Canvas>
          )}
        </Box>
      </Box>

      {/* DIÁLOGO DE CONFIRMACIÓN AL CANCELAR */}
      <ConfirmDialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={() => {
          setShowCancelDialog(false);
          onBack();
        }}
        title="¿Cancelar cambios?"
        message="Tienes cambios sin guardar. Si cancelas ahora, perderás todos los datos ingresados. ¿Estás seguro de que deseas cancelar?"
        confirmText="Sí, cancelar"
        cancelText="Continuar editando"
      />
    </Box>
  );
}