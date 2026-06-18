"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Objeto compartido para posición del mouse — evita re-renders en cada movimiento
const mouse = { x: 0, y: 0 };

// ─── TorusKnot principal ──────────────────────────────────────────────────────
function TorusKnot({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const smooth = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    const m = meshRef.current;
    if (!m) return;

    if (!reducedMotion) {
      m.rotation.y += delta * 0.18;
      m.rotation.x += delta * 0.07;
    }

    // Suavizar y aplicar influencia del mouse
    smooth.current.x += (mouse.x * 0.4 - smooth.current.x) * 0.04;
    smooth.current.y += (mouse.y * 0.4 - smooth.current.y) * 0.04;
    m.rotation.y += smooth.current.x * delta * 0.5;
    m.rotation.x += smooth.current.y * delta * 0.5;
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.32, 180, 20]} />
      <meshStandardMaterial
        color="#ffffff"
        metalness={1}
        roughness={0.08}
      />
    </mesh>
  );
}

// ─── Esfera wireframe de fondo ────────────────────────────────────────────────
function WireframeSphere({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current || reducedMotion) return;
    meshRef.current.rotation.y += delta * 0.04;
    meshRef.current.rotation.x += delta * 0.02;
  });

  return (
    <mesh ref={meshRef} scale={2.8}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial
        color="#ffffff"
        wireframe
        transparent
        opacity={0.04}
      />
    </mesh>
  );
}

// ─── Icosaedro simplificado para mobile ──────────────────────────────────────
function MobileShape({ reducedMotion }: { reducedMotion: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current || reducedMotion) return;
    meshRef.current.rotation.y += delta * 0.2;
    meshRef.current.rotation.x += delta * 0.08;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.15} />
    </mesh>
  );
}

// ─── Componente principal exportado ──────────────────────────────────────────
export default function HeroCanvas() {
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Preferencias de movimiento
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMqChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onMqChange);

    // Tamaño de pantalla
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Tracking del mouse (solo desktop)
    const onMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      mq.removeEventListener("change", onMqChange);
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{
        position: "absolute",
        inset: 0,
        background: "transparent",
      }}
    >
      <ambientLight intensity={0.15} />
      <pointLight position={[3, 3, 3]} intensity={2.5} color="#ffffff" />
      <pointLight position={[-3, -1, 2]} intensity={0.4} color="#8888ff" />

      {isMobile ? (
        <MobileShape reducedMotion={reducedMotion} />
      ) : (
        <>
          <TorusKnot reducedMotion={reducedMotion} />
          <WireframeSphere reducedMotion={reducedMotion} />
        </>
      )}
    </Canvas>
  );
}
