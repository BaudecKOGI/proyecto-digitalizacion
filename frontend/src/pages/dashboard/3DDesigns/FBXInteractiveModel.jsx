import * as React from "react";
import { useRef, useEffect, useMemo } from "react";
import { useFBX } from "@react-three/drei";

/**
 * COMPONENTE DE MODELO FBX INTERACTIVO
 * Maneja carga FBX con clonación en memoria (para que cada Canvas sea independiente)
 * y manipulación directa en 3D de piezas mecánicas configuradas.
 */
export default function FBXInteractiveModel({ url, piezasMoviles, setHabilitarCamara }) {
  const fbxRaw = useFBX(url);

  // Clonamos el FBX para que cada instancia del visor tenga una escena independiente
  const fbx = useMemo(() => {
    if (!fbxRaw) return null;
    return fbxRaw.clone(true);
  }, [fbxRaw]);

  const originalRotations = useRef({});
  const dragRef = useRef(null);

  useEffect(() => {
    if (!fbx) return;
    originalRotations.current = {};
    fbx.traverse((child) => {
      originalRotations.current[child.uuid] = {
        x: child.rotation.x,
        y: child.rotation.y,
        z: child.rotation.z
      };
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
        if (setHabilitarCamara) setHabilitarCamara(true);
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
        return { mesh: nodoActual, config: piezaConfig };
      }
      nodoActual = nodoActual.parent;
    }
    return null;
  };

  const handlePointerDown = (e) => {
    e.stopPropagation();
    if (!piezasMoviles || piezasMoviles.length === 0) return;

    const resultado = encontrarConfiguracionDePieza(e.object);
    if (resultado) {
      if (setHabilitarCamara) setHabilitarCamara(false);
      dragRef.current = {
        mesh: resultado.mesh,
        config: resultado.config,
        lastX: e.clientX,
        lastY: e.clientY
      };
      document.body.style.cursor = "grabbing";
    }
  };

  const handlePointerOver = (e) => {
    e.stopPropagation();
    if (!piezasMoviles || piezasMoviles.length === 0) return;
    if (encontrarConfiguracionDePieza(e.object)) {
      document.body.style.cursor = "grab";
    }
  };

  const handlePointerOut = () => {
    if (!dragRef.current) {
      document.body.style.cursor = "auto";
    }
  };

  if (!fbx) return null;

  return (
    <primitive
      object={fbx}
      onPointerDown={handlePointerDown}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    />
  );
}
