import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Section3D from "./3DSection";
import DigitalSection from "./DigitalSection";

export default function HorizontalShowcase({ onOpenGallery3D, onOpenGallerySoftware }) {
  const targetRef = useRef(null);

  // Track scroll progress within this 200vh tall container
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Slide the track: at 0% (top) show first pane, at 100vh scroll show second pane (-100vw)
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-100vw"]);

  return (
    <div ref={targetRef} className="relative h-[200vh]">
      {/* Sticky viewport-sized container */}
      <div className="sticky top-0 h-screen w-screen overflow-hidden">

        {/* The horizontal sliding track — 200vw wide, no gaps */}
        <motion.div
          style={{ x, width: "200vw" }}
          className="flex h-screen"
        >
          {/* First Pane: 3D Section — exactly 100vw × 100vh */}
          <div id="showcase-3d" className="shrink-0 overflow-hidden" style={{ width: "100vw", height: "100vh" }}>
            <Section3D onOpenGallery={onOpenGallery3D} />
          </div>

          {/* Second Pane: Digital Section — exactly 100vw × 100vh */}
          <div id="showcase-dig" className="shrink-0 overflow-hidden" style={{ width: "100vw", height: "100vh" }}>
            <DigitalSection onOpenGallery={onOpenGallerySoftware} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}