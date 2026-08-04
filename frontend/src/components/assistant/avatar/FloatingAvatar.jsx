// src/components/assistant/avatar/FloatingAvatar.jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { RobotHead } from './RobotHead3D';

/* ─── Botón flotante con Canvas ─── */
export default function FloatingAvatar({ onClick, isOpen }) {
  return (
    <motion.button
      onClick={onClick}
      aria-label="Abrir asistente del Fab Lab"
      className="relative flex items-center justify-center focus:outline-none"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      style={{ width: 72, height: 72 }}
    >
      {/* Glow pulsante */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.55) 0%, transparent 70%)' }}
        animate={{ scale: isOpen ? 1.1 : [1, 1.18, 1], opacity: isOpen ? 0.9 : [0.7, 1, 0.7] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Círculo base */}
      <div
        className="relative z-10 rounded-full overflow-hidden"
        style={{
          width: 72,
          height: 72,
          background: 'linear-gradient(145deg, #3730A3 0%, #6366F1 60%, #818CF8 100%)',
          boxShadow: isOpen
            ? '0 0 0 3px #818CF8, 0 8px 32px rgba(99,102,241,0.6)'
            : '0 4px 24px rgba(99,102,241,0.5)',
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 3.2], fov: 45 }}
          style={{ width: '100%', height: '100%' }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[2, 3, 2]} intensity={1.5} color="#A5B4FC" />
          <pointLight position={[-2, -1, 1]} intensity={0.5} color="#34D399" />
          <RobotHead />
        </Canvas>
      </div>

      {/* Indicador online */}
      <motion.div
        className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white z-20"
        style={{ backgroundColor: '#10B981' }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.button>
  );
}
