"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 220;

function Snow() {
  const points = useRef<THREE.Points>(null);

  const { positions, speeds } = useMemo(
    () => ({
      positions: new Float32Array(COUNT * 3),
      speeds: new Float32Array(COUNT),
    }),
    []
  );

  // Aleatoriedad inicial en un efecto (no durante el render)
  useEffect(() => {
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = Math.random() * 10 - 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      speeds[i] = 0.4 + Math.random() * 0.6;
    }
    if (points.current) {
      points.current.geometry.attributes.position.needsUpdate = true;
    }
  }, [positions, speeds]);

  useFrame((_, delta) => {
    if (!points.current) return;
    const arr = points.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] -= speeds[i] * delta * 1.2;
      arr[i * 3] += Math.sin((arr[i * 3 + 1] + i) * 0.5) * delta * 0.15;
      if (arr[i * 3 + 1] < -5) {
        arr[i * 3 + 1] = 5;
        arr[i * 3] = (Math.random() - 0.5) * 10;
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}

/** Nieve cayendo, decorativa, se sobrepone encima de cualquier contenido. */
export default function SnowOverlay() {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none" }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} gl={{ alpha: true }}>
        <Snow />
      </Canvas>
    </div>
  );
}
