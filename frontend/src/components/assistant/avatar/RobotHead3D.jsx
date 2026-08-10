// src/components/assistant/avatar/RobotHead3D.jsx
// Componente reutilizable: el robot 3D que se usa tanto en el botón flotante como en el chat
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

/* ─── Geometría del robot (compartida) ─── */
export function RobotHead() {
  const groupRef = useRef();
  const eyeLeftRef = useRef();
  const eyeRightRef = useRef();
  const antennaRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 1.4) * 0.06;
    groupRef.current.rotation.z = Math.sin(t * 0.9) * 0.04;
    groupRef.current.rotation.y = Math.sin(t * 0.6) * 0.12;
    const blink = t % 4 < 0.12 ? 0.05 : 1;
    eyeLeftRef.current.scale.y = blink;
    eyeRightRef.current.scale.y = blink;
    antennaRef.current.rotation.z = Math.sin(t * 2.2) * 0.18;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Cabeza */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.9, 0.8, 0.7]} />
        <meshStandardMaterial color="#4F46E5" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Visor */}
      <mesh position={[0, 0.02, 0.36]}>
        <boxGeometry args={[0.68, 0.38, 0.02]} />
        <meshStandardMaterial color="#1E1B4B" metalness={0.9} roughness={0.05} />
      </mesh>
      {/* Ojo izquierdo */}
      <mesh ref={eyeLeftRef} position={[-0.17, 0.06, 0.38]}>
        <circleGeometry args={[0.09, 16]} />
        <meshStandardMaterial color="#818CF8" emissive="#6366F1" emissiveIntensity={1.5} />
      </mesh>
      {/* Ojo derecho */}
      <mesh ref={eyeRightRef} position={[0.17, 0.06, 0.38]}>
        <circleGeometry args={[0.09, 16]} />
        <meshStandardMaterial color="#818CF8" emissive="#6366F1" emissiveIntensity={1.5} />
      </mesh>
      {/* Boca LED */}
      <mesh position={[0, -0.12, 0.38]}>
        <boxGeometry args={[0.36, 0.04, 0.01]} />
        <meshStandardMaterial color="#34D399" emissive="#10B981" emissiveIntensity={2} />
      </mesh>
      {/* Cuello */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.14, 0.18, 0.18, 8]} />
        <meshStandardMaterial color="#3730A3" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Cuerpo */}
      <mesh position={[0, -0.95, 0]}>
        <boxGeometry args={[1.1, 0.75, 0.65]} />
        <meshStandardMaterial color="#3730A3" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Panel pecho */}
      <mesh position={[0, -0.92, 0.34]}>
        <boxGeometry args={[0.55, 0.38, 0.02]} />
        <meshStandardMaterial color="#1E1B4B" metalness={0.9} roughness={0.05} />
      </mesh>
      {/* LED pecho */}
      <mesh position={[0, -0.88, 0.35]}>
        <circleGeometry args={[0.06, 12]} />
        <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={2} />
      </mesh>
      {/* Antena */}
      <group ref={antennaRef} position={[0, 0.44, 0]}>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.32, 8]} />
          <meshStandardMaterial color="#818CF8" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.34, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#C7D2FE" emissive="#A5B4FC" emissiveIntensity={1.8} />
        </mesh>
      </group>
      {/* Hombro izquierdo */}
      <mesh position={[-0.72, -0.88, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="#4338CA" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[-0.72, -1.2, 0]} rotation={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.1, 0.09, 0.5, 8]} />
        <meshStandardMaterial color="#4338CA" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Hombro derecho */}
      <mesh position={[0.72, -0.88, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="#4338CA" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0.72, -1.2, 0]} rotation={[0, 0, -0.1]}>
        <cylinderGeometry args={[0.1, 0.09, 0.5, 8]} />
        <meshStandardMaterial color="#4338CA" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ─── Mini avatar para usar dentro del chat ─── */
export function MiniRobotAvatar({ size = 36 }) {
  return (
    <div
      className="shrink-0 rounded-full overflow-hidden"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(145deg, #3730A3 0%, #6366F1 60%, #818CF8 100%)',
        boxShadow: '0 2px 10px rgba(99,102,241,0.4)',
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
  );
}
