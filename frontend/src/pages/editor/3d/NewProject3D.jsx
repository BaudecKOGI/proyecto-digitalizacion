import React, { useState, useEffect, Suspense, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, Save, X, Box as BoxIcon, Plus, Trash2, 
  Eye, FileEdit, Info 
} from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { fetchCategorias, createProyecto3D } from '@/services/api';
import { ODS_LIST } from "@/pages/dashboard/digitalProjects/odsData";

// --- IMPORTACIONES 3D ---
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useFBX } from '@react-three/drei';

// --- COMPONENTE INTERNO PARA EL MODELO Y LA MANIPULACIÓN DIRECTA ---
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

      // Aquí aplicamos la lógica de invertir giro
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
        document.body.style.cursor = 'auto';
      }
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);

    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
    };
  }, [setHabilitarCamara]);

  // Función para buscar el nombre en el objeto tocado o en sus "padres" (Grupos)
  const encontrarConfiguracionDePieza = (objetoTocado) => {
    let nodoActual = objetoTocado;
    
    while (nodoActual) {
      const nombreNodo = nodoActual.name ? nodoActual.name.trim().toLowerCase() : '';
      
      const piezaConfig = piezasMoviles.find(
        p => p.nombre_objeto && p.nombre_objeto.trim().toLowerCase() === nombreNodo
      );

      if (piezaConfig) {
        return { config: piezaConfig, mesh: nodoActual };
      }
      
      // Si no lo encuentra, sube un nivel al grupo padre
      nodoActual = nodoActual.parent;
    }
    return null;
  };

  const onPointerDown = (e) => {
    const resultado = encontrarConfiguracionDePieza(e.object);

    if (resultado) {
      // Detenemos el evento para que OrbitControls no mueva toda la escena
      e.stopPropagation(); 
      setHabilitarCamara(false); 
      
      dragRef.current = {
        mesh: resultado.mesh, // Rotamos el grupo/malla correcto
        config: resultado.config,
        lastX: e.clientX,
        lastY: e.clientY
      };
      document.body.style.cursor = 'grabbing';
    }
  };

  const onPointerOver = (e) => {
    const resultado = encontrarConfiguracionDePieza(e.object);
    if (resultado) {
      e.stopPropagation();
      document.body.style.cursor = 'grab';
    }
  };

  const onPointerOut = () => {
    if (!dragRef.current) document.body.style.cursor = 'auto';
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

export const NewProject3D = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    titulo: '', 
    descripcion: '', 
    autor_nombre: '',
    carrera: '', 
    ciclo: '', 
    estado_publicacion: 'BORRADOR', 
    categoria: '', 
    ods: '',
  });

  const [archivoFbx, setArchivoFbx] = useState(null);
  const [fbxUrl, setFbxUrl] = useState(null); 
  const [imagenMiniatura, setImagenMiniatura] = useState(null);

  const [piezasMoviles, setPiezasMoviles] = useState([]);
  const [habilitarCamara, setHabilitarCamara] = useState(true);

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const data = await fetchCategorias();
        const listaCategorias = Array.isArray(data) ? data : data?.results || [];
        setCategorias(listaCategorias);
      } catch (err) {
        console.error("Error cargando categorías:", err);
      }
    };
    loadCategorias();
  }, []);

  useEffect(() => {
    if (archivoFbx) {
      const url = URL.createObjectURL(archivoFbx);
      setFbxUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setFbxUrl(null);
    }
  }, [archivoFbx]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEstadoChange = (estado) => {
    setFormData(prev => ({ ...prev, estado_publicacion: estado }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      if (name === 'archivo_fbx') setArchivoFbx(files[0]);
      if (name === 'imagen_miniatura') setImagenMiniatura(files[0]);
    }
  };

  const agregarPieza = () => {
    setPiezasMoviles([
      ...piezasMoviles,
      { nombre_objeto: '', eje: 'x', etiqueta: '', min_giro: -180, max_giro: 180, invertir_giro: false }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'categoria') {
          if (formData.categoria) data.append('categoria', formData.categoria);
        } else if (key === 'ods') {
          if (formData.ods) data.append('ods', formData.ods);
        } else {
          data.append(key, formData[key]);
        }
      });

      if (user?.id) data.append('creado_por', user.id);
      
      if (archivoFbx) data.append('archivo_fbx', archivoFbx);
      else throw new Error("El archivo FBX es obligatorio.");
      
      if (imagenMiniatura) data.append('imagen_miniatura', imagenMiniatura);

      const configuracionJSON = JSON.stringify({ piezas_moviles: piezasMoviles });
      data.append('configuracion_interactiva', configuracionJSON);

      await createProyecto3D(data);
      navigate('/editor/3d/proyectos');
    } catch (err) {
      setError(err.message || "Error al crear el proyecto. Verifica los datos.");
    } finally {
      setLoading(false);
    }
  };

  // Clases predefinidas utilizando tus variables CSS
  const inputClassName = "w-full p-2.5 bg-[var(--bg-general)] border border-[var(--line)] rounded-lg text-[var(--text-main)] text-sm mb-4 outline-none focus:border-[var(--accent)] transition-colors";
  const labelClassName = "block text-xs font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-wide";
  const sectionTitleClassName = "text-base font-bold text-[var(--text-main)] border-b-2 border-[var(--line)] pb-2 mb-5 flex items-center gap-2";

  return (
    <div className="flex flex-col h-full">
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1 text-[var(--text-main)]">
          Subir Nuevo Modelo 3D
        </h2>
        <div className="text-sm text-[var(--text-muted)]">
          Sube tu archivo .fbx, configura sus datos y prueba sus interacciones mecánicas.
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 p-3 rounded-lg mb-6 border border-red-500/20 flex items-center gap-2">
          <Info size={18} /> {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[600px]">
        
        {/* PANEL DEL FORMULARIO */}
        <div className="flex-[0_0_45%] bg-[var(--panel)] p-6 rounded-xl border border-[var(--line)] overflow-y-auto max-h-[calc(100vh-180px)] shadow-sm">
          <form onSubmit={handleSubmit} id="project-form">
            
            <h3 className={sectionTitleClassName}>1. Estado de Publicación</h3>
            <div className="flex gap-3 mb-7">
              <button
                type="button"
                onClick={() => handleEstadoChange('PUBLICADO')}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg font-bold cursor-pointer transition-all duration-200 border ${
                  formData.estado_publicacion === 'PUBLICADO'
                    ? 'border-[var(--accent)] bg-[var(--accent-dim)] text-[var(--accent)]'
                    : 'border-[var(--line)] bg-[var(--bg-general)] text-[var(--text-muted)]'
                }`}
              >
                <Eye size={18} /> Público
              </button>
              <button
                type="button"
                onClick={() => handleEstadoChange('BORRADOR')}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg font-bold cursor-pointer transition-all duration-200 border ${
                  formData.estado_publicacion === 'BORRADOR'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-600'
                    : 'border-[var(--line)] bg-[var(--bg-general)] text-[var(--text-muted)]'
                }`}
              >
                <FileEdit size={18} /> Borrador
              </button>
            </div>

            <h3 className={sectionTitleClassName}>2. Información General</h3>
            <label className={labelClassName}>Título del Proyecto</label>
            <input className={inputClassName} type="text" name="titulo" value={formData.titulo} onChange={handleChange} placeholder="Ej. Motor V8" required />

            <div className="flex gap-4">
              <div className="flex-[2]">
                <label className={labelClassName}>Autor(es)</label>
                <input className={inputClassName} type="text" name="autor_nombre" value={formData.autor_nombre} onChange={handleChange} required />
              </div>
              <div className="flex-[2]">
                <label className={labelClassName}>Carrera</label>
                <input className={inputClassName} type="text" name="carrera" value={formData.carrera} onChange={handleChange} required />
              </div>
              <div className="flex-1">
                <label className={labelClassName}>Ciclo</label>
                <input className={inputClassName} type="text" name="ciclo" value={formData.ciclo} onChange={handleChange} required />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className={labelClassName}>Categoría</label>
                <select className={inputClassName} name="categoria" value={formData.categoria} onChange={handleChange} required>
                  <option value="">Seleccionar...</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className={labelClassName}>ODS de Impacto (ONU)</label>
                <select className={inputClassName} name="ods" value={formData.ods || ""} onChange={handleChange}>
                  <option value="">Ninguno / No especificado</option>
                  {ODS_LIST.map(o => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <label className={labelClassName}>Descripción</label>
            <textarea className={`${inputClassName} min-h-[80px] resize-y`} name="descripcion" value={formData.descripcion} onChange={handleChange} required />

            <h3 className={sectionTitleClassName}>3. Archivos y Recursos</h3>
            <div className="flex gap-4 mb-7">
              <div className={`flex-1 p-4 border-2 border-dashed rounded-lg text-center cursor-pointer relative transition-colors ${archivoFbx ? 'border-[var(--accent)] bg-[var(--accent-dim)]' : 'border-[var(--accent)] bg-[var(--accent-dim)]'}`}>
                <input type="file" name="archivo_fbx" accept=".fbx" onChange={handleFileChange} required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <Upload size={24} className="text-[var(--accent)] mx-auto mb-2" />
                <span className="text-[13px] font-bold text-[var(--text-main)] block">Subir .FBX *</span>
                <span className="text-[11px] text-[var(--accent)]">{archivoFbx ? archivoFbx.name : 'Obligatorio'}</span>
              </div>
              <div className="flex-1 p-4 border-2 border-dashed border-[var(--line)] bg-[var(--bg-general)] rounded-lg text-center cursor-pointer relative hover:border-[var(--text-muted)] transition-colors">
                <input type="file" name="imagen_miniatura" accept="image/png, image/jpeg" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <Upload size={24} className="text-[var(--text-muted)] mx-auto mb-2" />
                <span className="text-[13px] font-bold text-[var(--text-main)] block">Miniatura</span>
                <span className="text-[11px] text-[var(--text-muted)]">{imagenMiniatura ? imagenMiniatura.name : 'Opcional (JPG/PNG)'}</span>
              </div>
            </div>

            <h3 className={`${sectionTitleClassName} justify-between`}>
              <span>4. Controles Mecánicos (3D)</span>
              <button 
                type="button" 
                onClick={agregarPieza}
                className="flex items-center gap-1.5 bg-[var(--accent)] text-white border-none py-1.5 px-2.5 rounded-md text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity"
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
                      type="button" onClick={() => eliminarPieza(index)}
                      className="absolute top-3 right-3 bg-red-500/10 border-none text-red-500 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-500/20 transition-colors"
                      title="Eliminar pieza"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="flex gap-3 mb-3 pr-8">
                      <div className="flex-1">
                        <label className={`${labelClassName} !text-[11px]`}>ID de la pieza (FBX)</label>
                        <input type="text" className={`${inputClassName} !mb-0 !p-2`} placeholder="Ej: Rueda_Izq" value={pieza.nombre_objeto} onChange={(e) => actualizarPieza(index, 'nombre_objeto', e.target.value)} required />
                      </div>
                      <div className="flex-1">
                        <label className={`${labelClassName} !text-[11px]`}>Etiqueta (UI)</label>
                        <input type="text" className={`${inputClassName} !mb-0 !p-2`} placeholder="Ej: Girar Rueda" value={pieza.etiqueta} onChange={(e) => actualizarPieza(index, 'etiqueta', e.target.value)} required />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className={`${labelClassName} !text-[11px]`}>Eje</label>
                        <select className={`${inputClassName} !mb-0 !p-2`} value={pieza.eje} onChange={(e) => actualizarPieza(index, 'eje', e.target.value)}>
                          <option value="x">Eje X</option>
                          <option value="y">Eje Y</option>
                          <option value="z">Eje Z</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className={`${labelClassName} !text-[11px]`}>Límite Min (°)</label>
                        <input type="number" className={`${inputClassName} !mb-0 !p-2`} value={pieza.min_giro} onChange={(e) => actualizarPieza(index, 'min_giro', Number(e.target.value))} required />
                      </div>
                      <div className="flex-1">
                        <label className={`${labelClassName} !text-[11px]`}>Límite Max (°)</label>
                        <input type="number" className={`${inputClassName} !mb-0 !p-2`} value={pieza.max_giro} onChange={(e) => actualizarPieza(index, 'max_giro', Number(e.target.value))} required />
                      </div>
                      <div className="flex-1 flex flex-col justify-center">
                        <label className={`${labelClassName} !text-[11px] invisible`}>Invertir</label>
                        <label className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)] cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={pieza.invertir_giro || false} 
                            onChange={(e) => actualizarPieza(index, 'invertir_giro', e.target.checked)} 
                            className="cursor-pointer w-4 h-4 accent-[var(--accent)]"
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

        {/* VISOR 3D (Se mantiene oscuro por defecto de modelo 3D) */}
        <div className="flex-1 bg-[#1e293b] rounded-xl border border-[#334155] relative overflow-hidden flex items-center justify-center shadow-inner">
          
          {!fbxUrl ? (
            <div className="text-center text-slate-400">
              <BoxIcon size={64} className="mx-auto mb-4 opacity-30" />
              <p className="text-[15px] font-medium">Sube tu archivo .FBX a la izquierda<br/>para previsualizarlo aquí</p>
            </div>
          ) : (
            <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
              <color attach="background" args={['#1e293b']} />
              <Suspense fallback={null}>
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

      <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-[var(--line)]">
        <button 
          type="button" 
          onClick={() => navigate('/editor/3d/proyectos')} 
          className="px-5 py-2.5 rounded-lg border border-[var(--line)] bg-[var(--panel)] text-[var(--text-main)] font-bold flex items-center gap-2 cursor-pointer hover:bg-[var(--bg-general)] transition-colors"
        >
          <X size={16} /> Cancelar
        </button>
        <button 
          type="submit" 
          form="project-form" 
          disabled={loading} 
          className="px-6 py-2.5 rounded-lg border-none bg-[var(--accent)] text-white font-bold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          <Save size={16} /> {loading ? 'Guardando...' : 'Guardar Proyecto'}
        </button>
      </div>
    </div>
  );
};