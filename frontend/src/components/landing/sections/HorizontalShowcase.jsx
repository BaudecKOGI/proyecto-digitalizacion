import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Section3D from "./3DSection";
import DigitalSection from "./DigitalSection";

export default function HorizontalShowcase({ onOpenGallery3D, onOpenGallerySoftware }) {
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Para el movimiento entre las dos secciones
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-100vw"]);

  return (
    <div ref={targetRef} className="relative h-[200vh]">
      {/* El contenedor que se mantiene fijo */}
      <div className="sticky top-0 h-screen w-screen overflow-hidden">

        {/* La vía horizontal deslizante */}
        <motion.div
          style={{ x, width: "200vw" }}
          className="flex h-screen"
        >
          {/* Sección 3D */}
          <div id="showcase-3d" className="shrink-0 overflow-hidden" style={{ width: "100vw", height: "100vh" }}>
            <Section3D onOpenGallery={onOpenGallery3D} />
          </div>

          {/* Sección Digital */}
          <div id="showcase-dig" className="shrink-0 overflow-hidden" style={{ width: "100vw", height: "100vh" }}>
            <DigitalSection onOpenGallery={onOpenGallerySoftware} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}