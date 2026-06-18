"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function FloatingRings({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (reducedMotion || !groupRef.current) return;
    groupRef.current.rotation.x += delta * 0.08;
    groupRef.current.rotation.y += delta * 0.12;
  });

  return (
    <Float speed={reducedMotion ? 0 : 1.2} floatIntensity={0.5}>
      <group ref={groupRef} position={[2.8, 0, 0]}>
        {/* outer ring */}
        <mesh>
          <torusGeometry args={[1.4, 0.06, 16, 120]} />
          <meshStandardMaterial
            color="#6366f1"
            emissive="#4f46e5"
            emissiveIntensity={0.5}
            transparent
            opacity={0.75}
          />
        </mesh>
        {/* mid ring tilted */}
        <mesh rotation={[Math.PI / 2.5, 0.3, 0]}>
          <torusGeometry args={[1.0, 0.04, 16, 100]} />
          <meshStandardMaterial
            color="#32d583"
            emissive="#22c55e"
            emissiveIntensity={0.4}
            transparent
            opacity={0.65}
          />
        </mesh>
        {/* inner ring tilted other way */}
        <mesh rotation={[0, Math.PI / 3, Math.PI / 4]}>
          <torusGeometry args={[0.65, 0.035, 16, 80]} />
          <meshStandardMaterial
            color="#818cf8"
            emissive="#6366f1"
            emissiveIntensity={0.3}
            transparent
            opacity={0.55}
          />
        </mesh>
      </group>
    </Float>
  );
}

export default function Hero3D() {
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="absolute inset-0 -z-10 hidden mdsm:block" style={{ background: 'transparent' }}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <ambientLight intensity={1.0} />
        <pointLight position={[5, 5, 5]} intensity={2} />
        <pointLight position={[-2, -2, 3]} intensity={0.8} color="#6366f1" />
        <FloatingRings reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
