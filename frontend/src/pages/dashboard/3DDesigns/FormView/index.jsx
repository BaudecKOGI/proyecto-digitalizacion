import * as React from "react";
import { useState, useEffect, Suspense } from "react";
import { Box, Button, Typography, Paper, Divider, Stack, Alert } from "@mui/material";
import { ArrowLeft as BackIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { Box as BoxIcon } from "lucide-react";
import ConfirmDialog from "@/components/core/ConfirmDialog";

// API
import { fetchCarreras } from "@/services/api";

// 3D
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, Html } from "@react-three/drei";

// Sub-Componentes
import InformacionBasica from "./InformacionBasica";
import ArchivosYControles from "./ArchivosYControles";
import VisorInteractividad3D from "./VisorInteractividad3D";

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

  const [carreras, setCarreras] = useState([]);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState(null);
  const [cicloSeleccionado, setCicloSeleccionado] = useState(null);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [initialFormState, setInitialFormState] = useState(null);
  const [initialPiezasState, setInitialPiezasState] = useState(null);

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

  useEffect(() => {
    if (editingDiseno && editingDiseno.carrera) {
      const found = carreras.find(c => c.id === editingDiseno.carrera);
      if (found) {
        setCarreraSeleccionada(found.id);
        if (editingDiseno.ciclo) setCicloSeleccionado(editingDiseno.ciclo);
      }
    }
  }, [editingDiseno, carreras]);

  useEffect(() => {
    if (carreraSeleccionada !== undefined && carreraSeleccionada !== null) {
      setFormDiseno(prev => ({ ...prev, carrera: carreraSeleccionada }));
    }
  }, [carreraSeleccionada, setFormDiseno]);

  useEffect(() => {
    if (cicloSeleccionado !== undefined && cicloSeleccionado !== null) {
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
    if (!initialFormState && formDiseno) setInitialFormState(JSON.stringify(formDiseno));
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
    if (hasUnsavedChanges()) setShowCancelDialog(true);
    else onBack();
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
        try { config = JSON.parse(config); } catch (e) { config = {}; }
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
    setPiezasMoviles([...piezasMoviles, { nombre_objeto: "", eje: "x", etiqueta: "", min_giro: -180, max_giro: 180, invertir_giro: false }]);
  };
  const actualizarPieza = (index, campo, valor) => {
    const nuevas = [...piezasMoviles];
    nuevas[index][campo] = valor;
    setPiezasMoviles(nuevas);
  };
  const eliminarPieza = (index) => setPiezasMoviles(piezasMoviles.filter((_, i) => i !== index));

  const handleSubmitForm = (e) => {
    e.preventDefault();
    onSave(e, piezasMoviles);
  };

  const fieldSx = {
    bgcolor: "#F8FAFC", borderRadius: "2px 2px 0 0",
    "& .MuiOutlinedInput-root": {
      bgcolor: "#F8FAFC", borderRadius: "2px 2px 0 0",
      "& fieldset": { border: "none", borderBottom: "1px solid #002B49" },
      "&:hover fieldset": { border: "none", borderBottom: "1.5px solid #002B49" },
      "&.Mui-focused fieldset": { border: "none", borderBottom: "2px solid #002B49" }
    },
    "& .MuiInputBase-input": { py: 1.2, px: 1.5, fontSize: "0.95rem", color: "#0F172A", fontWeight: 500 }
  };

  const selectSx = {
    bgcolor: "#F8FAFC", borderRadius: "2px 2px 0 0",
    "& .MuiOutlinedInput-notchedOutline": { border: "none", borderBottom: "1px solid #002B49" },
    "&:hover .MuiOutlinedInput-notchedOutline": { border: "none", borderBottom: "1.5px solid #002B49" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none", borderBottom: "2px solid #002B49" },
    "& .MuiSelect-select": { py: 1.2, px: 1.5, fontSize: "0.95rem", color: "#0F172A", fontWeight: 500 }
  };

  const labelSx = { fontWeight: 600, color: "#1E293B", mb: 0.6, fontSize: "0.85rem" };

  return (
    <Box sx={{ width: "100%", pb: 6 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, pb: 2, borderBottom: "1px solid", borderColor: "divider", flexWrap: "wrap", gap: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button variant="outlined" onClick={onBack} startIcon={<BackIcon size={18} />} sx={{ textTransform: "none", fontWeight: 600, borderRadius: "2px", borderColor: "#002B49", color: "#002B49", "&:hover": { bgcolor: "rgba(0, 43, 73, 0.04)", borderColor: "#002B49" } }}>
            Volver a Modelos
          </Button>
          <Typography variant="h6" fontWeight={700} sx={{ color: "text.primary" }}>
            {editingDiseno ? "Editar Modelo 3D" : "Crear Modelo 3D"}
          </Typography>
        </Stack>
      </Box>

      {formError && <Alert severity="error" sx={{ mb: 3, borderRadius: "2px" }}>{formError}</Alert>}

      <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 4, alignItems: "flex-start" }}>
        <Paper elevation={0} component="form" id="diseno3d-form" onSubmit={handleSubmitForm} sx={{ flex: { xs: "1 1 100%", lg: "0 0 46%" }, width: "100%", p: { xs: 2.5, sm: 4 }, borderRadius: "6px", border: "1px solid rgba(0, 0, 0, 0.05)", boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)", bgcolor: "#FFFFFF" }}>
          <Typography variant="h5" fontWeight={800} gutterBottom sx={{ color: "text.primary", mb: 0.5 }}>
            {editingDiseno ? "Editar Modelo 3D" : "Crear Nuevo Modelo 3D"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Completa la información general, carga el modelo 3D y configura las interacciones mecánicas del proyecto.
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <InformacionBasica
            formDiseno={formDiseno}
            setFormDiseno={setFormDiseno}
            editingDiseno={editingDiseno}
            carreras={carreras}
            carreraSeleccionada={carreraSeleccionada}
            setCarreraSeleccionada={setCarreraSeleccionada}
            cicloSeleccionado={cicloSeleccionado}
            setCicloSeleccionado={setCicloSeleccionado}
            opcionesCiclos={opcionesCiclos}
            categorias={categorias}
            labelSx={labelSx}
            fieldSx={fieldSx}
            selectSx={selectSx}
          />

          <ArchivosYControles
            editingDiseno={editingDiseno}
            archivoFBX={archivoFBX}
            setArchivoFBX={setArchivoFBX}
            imagenMiniatura={imagenMiniatura}
            setImagenMiniatura={setImagenMiniatura}
            piezasMoviles={piezasMoviles}
            agregarPieza={agregarPieza}
            actualizarPieza={actualizarPieza}
            eliminarPieza={eliminarPieza}
            labelSx={labelSx}
            fieldSx={fieldSx}
            selectSx={selectSx}
          />

          <Divider sx={{ my: 4 }} />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button type="button" variant="outlined" onClick={handleCancelClick} sx={{ borderRadius: "2px", textTransform: "none", fontWeight: 600, fontSize: "0.95rem", color: "#002B49", borderColor: "#002B49", px: 3.5, py: 0.9, "&:hover": { borderColor: "#002B49", bgcolor: "rgba(0, 43, 73, 0.04)" } }}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" sx={{ textTransform: "none", fontWeight: 600, borderRadius: "2px", px: 4, py: 0.9, bgcolor: "#002B49", color: "#FFFFFF", boxShadow: "none", "&:hover": { bgcolor: "#001e33", boxShadow: "none" } }}>
              {editingDiseno ? "Actualizar Proyecto" : "Crear Modelo 3D"}
            </Button>
          </Stack>
        </Paper>

        <Box sx={{ flex: { xs: "1 1 100%", lg: "1 1 auto" }, width: { xs: "100%", lg: "auto" }, minWidth: { lg: 420 }, height: { xs: 480, lg: "calc(100vh - 80px)" }, position: { lg: "sticky" }, top: { lg: 24 }, bgcolor: "#1e293b", borderRadius: "6px", border: "1px solid #334155", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {!fbxUrl ? (
            <Box sx={{ textAlign: "center", color: "#94a3b8", p: 3 }}>
              <BoxIcon size={64} style={{ opacity: 0.3, marginBottom: 16 }} />
              <Typography variant="body2" fontWeight={500}>
                Sube tu archivo .FBX a la izquierda<br />para previsualizarlo aquí
              </Typography>
            </Box>
          ) : (
            <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }} style={{ width: "100%", height: "100%" }}>
              <color attach="background" args={["#1e293b"]} />
              <Suspense fallback={<Html center><Typography sx={{ color: "#22d3ee", fontWeight: 700, fontSize: 14 }}>Cargando modelo 3D...</Typography></Html>}>
                <Stage environment="city" intensity={0.6}>
                  <VisorInteractividad3D url={fbxUrl} piezasMoviles={piezasMoviles} setHabilitarCamara={setHabilitarCamara} />
                </Stage>
              </Suspense>
              <OrbitControls makeDefault enabled={habilitarCamara} />
            </Canvas>
          )}
        </Box>
      </Box>

      <ConfirmDialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)} onConfirm={() => { setShowCancelDialog(false); onBack(); }} title="¿Cancelar cambios?" message="Tienes cambios sin guardar. Si cancelas ahora, perderás todos los datos ingresados. ¿Estás seguro de que deseas cancelar?" confirmText="Sí, cancelar" cancelText="Continuar editando" />
    </Box>
  );
}
