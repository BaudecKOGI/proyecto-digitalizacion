import React, { useState, useEffect, Suspense, useRef } from "react";
import { 
  Upload, Save, X, Box as BoxIcon, Plus, Trash2, 
  Eye, FileEdit, Info 
} from "lucide-react";
import { ODS_LIST } from "@/pages/dashboard/digitalProjects/odsData";

// --- IMPORTACIONES 3D ---
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, useFBX, Html } from "@react-three/drei";

// --- COMPONENTE INTERNO PARA EL MODELO Y LA MANIPULACIÓN DIRECTA (MECÁNICA 3D) ---
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

      // Sensibilidad de giro
      const sensiblidad = config.invertir_giro ? -0.01 : 0.01;
      const cambioRotacion = (deltaX + deltaY) * sensiblidad;

      const baseRot = originalRotations.current[mesh.uuid]?.[config.eje] || 0;
      const minRad = baseRot + (config.min_giro * Math.PI / 180);
      const maxRad = baseRot + (config.max_giro * Math.PI / 180);

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
        p => p.nombre_objeto && p.nombre_objeto.trim().toLowerCase() === nombreNodo
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
    setPiezasMoviles([
      ...piezasMoviles,
      { nombre_objeto: "", eje: "x", etiqueta: "", min_giro: -180, max_giro: 180, invertir_giro: false }
    ]);
  };

  const actualizarPieza = (index, campo, valor) => {
    const nuevasPiezas = [...piezasMoviles];
    nuevasPiezas[index][campo] = valor;
    setPiezasMoviles(nuevasPiezas);
  };

  const eliminarPieza = (index) => {
    const nuevasPiezas = piezasMoviles.filter((_, i) => i !== index);
    setPiezasMoviles(nuevasPiezas);
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    onSave(e, piezasMoviles);
  };

  // Clases predefinidas fieles al estilo visual del Editor y la imagen de referencia
  const inputClassName =
    "w-full p-2.5 bg-[var(--bg-general)] border border-[var(--line)] rounded-lg text-[var(--text-main)] text-sm mb-4 outline-none focus:border-[#06b6d4] transition-colors";
  const labelClassName =
    "block text-xs font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-wide";
  const sectionTitleClassName =
    "text-base font-bold text-[var(--text-main)] border-b-2 border-[var(--line)] pb-2 mb-5 flex items-center justify-between";

  return (
    <div className="flex flex-col h-full w-full">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1 text-[var(--text-main)]">
            {editingDiseno ? `Editar Diseño 3D: ${formDiseno.titulo || ""}` : "Subir Nuevo Diseño 3D"}
          </h2>
          <div className="text-sm text-[var(--text-muted)]">
            {editingDiseno
              ? "Modifica la información general o la configuración mecánica de tu proyecto."
              : "Sube tu archivo .fbx, configura sus datos y prueba sus interacciones mecánicas en tiempo real."}
          </div>
        </div>
      </div>

      {formError && (
        <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-6 border border-red-500/20 flex items-center gap-2">
          <Info size={18} /> {formError}
        </div>
      )}

      {/* CONTENEDOR EN DOS COLUMNAS: FORMULARIO (45%) Y DEMO 3D (FLEX-1) */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[620px]">
        {/* LADO IZQUIERDO: FORMULARIO DEL PROYECTO */}
        <div className="flex-[0_0_46%] bg-[var(--panel)] p-6 rounded-xl border border-[var(--line)] overflow-y-auto max-h-[calc(100vh-180px)] shadow-sm">
          <form onSubmit={handleSubmitForm} id="diseno3d-form">
            {/* SECCIÓN 1: ESTADO DE PUBLICACIÓN */}
            <h3 className={sectionTitleClassName}>
              <span>1. Estado de Publicación</span>
            </h3>
            <div className="flex gap-3 mb-7">
              <button
                type="button"
                onClick={() => setFormDiseno({ ...formDiseno, estado_publicacion: "PUBLICADO" })}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg font-bold cursor-pointer transition-all duration-200 border ${
                  formDiseno.estado_publicacion === "PUBLICADO"
                    ? "border-[#06b6d4] bg-[#ecfeff] text-[#0891b2] dark:bg-[#06b6d4]/15 dark:text-[#22d3ee]"
                    : "border-[var(--line)] bg-[var(--bg-general)] text-[var(--text-muted)]"
                }`}
              >
                <Eye size={18} /> Público
              </button>
              <button
                type="button"
                onClick={() => setFormDiseno({ ...formDiseno, estado_publicacion: "BORRADOR" })}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg font-bold cursor-pointer transition-all duration-200 border ${
                  formDiseno.estado_publicacion === "BORRADOR"
                    ? "border-amber-500 bg-amber-500/10 text-amber-600"
                    : "border-[var(--line)] bg-[var(--bg-general)] text-[var(--text-muted)]"
                }`}
              >
                <FileEdit size={18} /> Borrador
              </button>
            </div>

            {/* SECCIÓN 2: INFORMACIÓN GENERAL */}
            <h3 className={sectionTitleClassName}>
              <span>2. Información General</span>
            </h3>
            <label className={labelClassName}>Título del Proyecto</label>
            <input
              className={inputClassName}
              type="text"
              name="titulo"
              value={formDiseno.titulo}
              onChange={(e) => setFormDiseno({ ...formDiseno, titulo: e.target.value })}
              placeholder="Ej. Brazo Robótico Articulado"
              required
            />

            <div className="flex gap-4">
              <div className="flex-[2]">
                <label className={labelClassName}>Autor(es)</label>
                <input
                  className={inputClassName}
                  type="text"
                  name="autor_nombre"
                  value={formDiseno.autor_nombre}
                  onChange={(e) => setFormDiseno({ ...formDiseno, autor_nombre: e.target.value })}
                  placeholder="Ej. Alessandro"
                  required
                />
              </div>
              <div className="flex-[2]">
                <label className={labelClassName}>Carrera</label>
                <input
                  className={inputClassName}
                  type="text"
                  name="carrera"
                  value={formDiseno.carrera}
                  onChange={(e) => setFormDiseno({ ...formDiseno, carrera: e.target.value })}
                  placeholder="Ej. Arquitectura"
                  required
                />
              </div>
              <div className="flex-1">
                <label className={labelClassName}>Ciclo</label>
                <input
                  className={inputClassName}
                  type="text"
                  name="ciclo"
                  value={formDiseno.ciclo}
                  onChange={(e) => setFormDiseno({ ...formDiseno, ciclo: e.target.value })}
                  placeholder="Ej. III"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className={labelClassName}>Categoría</label>
                <select
                  className={inputClassName}
                  name="categoria"
                  value={formDiseno.categoria || ""}
                  onChange={(e) => setFormDiseno({ ...formDiseno, categoria: e.target.value })}
                >
                  <option value="">Seleccionar...</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className={labelClassName}>ODS de Impacto (ONU)</label>
                <select
                  className={inputClassName}
                  name="ods"
                  value={formDiseno.ods || ""}
                  onChange={(e) => setFormDiseno({ ...formDiseno, ods: e.target.value })}
                >
                  <option value="">Ninguno / No especificado</option>
                  {ODS_LIST.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className={labelClassName}>Descripción</label>
            <textarea
              className={`${inputClassName} h-24 resize-none`}
              name="descripcion"
              value={formDiseno.descripcion}
              onChange={(e) => setFormDiseno({ ...formDiseno, descripcion: e.target.value })}
              placeholder="Descripción detallada del modelo 3D..."
              required
            />

            {/* SECCIÓN 3: ARCHIVOS (OPCIONAL EN EDICIÓN, OBLIGATORIO NUEVO) */}
            <h3 className={sectionTitleClassName}>
              <span>3. Archivos (Opcional)</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-7">
              {/* Box de Archivo FBX */}
              <label className="border border-dashed border-[var(--line)] rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#06b6d4] transition-colors bg-[var(--bg-general)]">
                <Upload size={24} className="text-[#06b6d4] mb-2" />
                <span className="text-xs font-bold text-[var(--text-main)] truncate max-w-full">
                  {archivoFBX
                    ? archivoFBX.name
                    : editingDiseno
                    ? "Actualizar .FBX"
                    : "Subir Modelo .FBX"}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] mt-0.5">
                  {editingDiseno ? "Se conservará el actual" : "Formato .fbx o .glb"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".fbx,.obj,.glb,.gltf"
                  onChange={(e) => setArchivoFBX(e.target.files?.[0] || null)}
                />
              </label>

              {/* Box de Miniatura */}
              <label className="border border-dashed border-[var(--line)] rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#06b6d4] transition-colors bg-[var(--bg-general)]">
                <Upload size={24} className="text-[#06b6d4] mb-2" />
                <span className="text-xs font-bold text-[var(--text-main)] truncate max-w-full">
                  {imagenMiniatura
                    ? imagenMiniatura.name
                    : editingDiseno
                    ? "Actualizar Miniatura"
                    : "Subir Portada"}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] mt-0.5">
                  {editingDiseno ? "Se conservará la actual" : "Imagen PNG, JPG"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setImagenMiniatura(e.target.files?.[0] || null)}
                />
              </label>
            </div>

            {/* SECCIÓN 4: CONTROLES MECÁNICOS (3D) */}
            <h3 className={sectionTitleClassName}>
              <span>4. Controles Mecánicos (3D)</span>
              <button
                type="button"
                onClick={agregarPieza}
                className="flex items-center gap-1.5 bg-[#06b6d4] text-white border-none py-1.5 px-2.5 rounded-md text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity"
              >
                <Plus size={14} /> Nueva Pieza
              </button>
            </h3>

            {piezasMoviles.length === 0 ? (
              <div className="text-center p-6 bg-[var(--bg-general)] rounded-lg border border-dashed border-[var(--line)] text-[13px] text-[var(--text-muted)]">
                No has agregado piezas móviles. Presiona "Nueva Pieza" para configurar la interacción.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {piezasMoviles.map((pieza, index) => (
                  <div key={index} className="bg-[var(--bg-general)] border border-[var(--line)] rounded-lg p-4 relative">
                    <button
                      type="button"
                      onClick={() => eliminarPieza(index)}
                      className="absolute top-3 right-3 bg-red-500/10 border-none text-red-500 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-500/20 transition-colors"
                      title="Eliminar pieza"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="flex gap-3 mb-3 pr-8">
                      <div className="flex-1">
                        <label className={`${labelClassName} !text-[11px]`}>ID de la pieza (FBX)</label>
                        <input
                          type="text"
                          className={`${inputClassName} !mb-0 !p-2`}
                          placeholder="Ej: Rueda_Izq"
                          value={pieza.nombre_objeto}
                          onChange={(e) => actualizarPieza(index, "nombre_objeto", e.target.value)}
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <label className={`${labelClassName} !text-[11px]`}>Etiqueta (UI)</label>
                        <input
                          type="text"
                          className={`${inputClassName} !mb-0 !p-2`}
                          placeholder="Ej: Girar Rueda"
                          value={pieza.etiqueta}
                          onChange={(e) => actualizarPieza(index, "etiqueta", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className={`${labelClassName} !text-[11px]`}>Eje</label>
                        <select
                          className={`${inputClassName} !mb-0 !p-2`}
                          value={pieza.eje}
                          onChange={(e) => actualizarPieza(index, "eje", e.target.value)}
                        >
                          <option value="x">Eje X</option>
                          <option value="y">Eje Y</option>
                          <option value="z">Eje Z</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className={`${labelClassName} !text-[11px]`}>Límite Min (°)</label>
                        <input
                          type="number"
                          className={`${inputClassName} !mb-0 !p-2`}
                          value={pieza.min_giro}
                          onChange={(e) => actualizarPieza(index, "min_giro", Number(e.target.value))}
                          required
                        />
                      </div>
                      <div className="flex-1">
                        <label className={`${labelClassName} !text-[11px]`}>Límite Max (°)</label>
                        <input
                          type="number"
                          className={`${inputClassName} !mb-0 !p-2`}
                          value={pieza.max_giro}
                          onChange={(e) => actualizarPieza(index, "max_giro", Number(e.target.value))}
                          required
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <label className={`${labelClassName} !text-[11px] invisible`}>Invertir</label>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={pieza.invertir_giro || false}
                            onChange={(e) => actualizarPieza(index, "invertir_giro", e.target.checked)}
                            className="cursor-pointer w-4 h-4 accent-[#06b6d4]"
                          />
                          Invertir Giro
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* LADO DERECHO: VISOR 3D EXACTO COMO EN LA IMAGEN DE REFERENCIA */}
        <div className="flex-1 bg-[#1e293b] rounded-xl border border-[#334155] relative overflow-hidden flex items-center justify-center shadow-inner min-h-[580px]">
          {!fbxUrl ? (
            <div className="text-center text-slate-400 p-6">
              <BoxIcon size={64} className="mx-auto mb-4 opacity-30" />
              <p className="text-[15px] font-medium">
                Sube tu archivo .FBX a la izquierda
                <br />
                para previsualizarlo aquí
              </p>
            </div>
          ) : (
            <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }} className="w-full h-full">
              <color attach="background" args={["#1e293b"]} />
              <Suspense
                fallback={
                  <Html center>
                    <div className="text-center text-[#22d3ee] font-bold text-sm">
                      Cargando modelo 3D...
                    </div>
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
        </div>
      </div>

      {/* BARRA INFERIOR DE BOTONES FIEL AL EJEMPLO DE LA IMAGEN */}
      <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-[var(--line)]">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-lg border border-[var(--line)] bg-[var(--panel)] text-[var(--text-main)] font-bold flex items-center gap-2 cursor-pointer hover:bg-[var(--bg-general)] transition-colors"
        >
          <X size={16} /> Cancelar
        </button>
        <button
          type="submit"
          form="diseno3d-form"
          className="px-6 py-2.5 rounded-lg border-none bg-[#06b6d4] text-white font-bold flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Save size={16} /> {editingDiseno ? "Actualizar Proyecto" : "Crear Diseño 3D"}
        </button>
      </div>
    </div>
  );
}
