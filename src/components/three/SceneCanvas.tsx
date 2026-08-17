"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

interface SceneCanvasProps {
  children: React.ReactNode;
  /** Config de cámara de R3F (position, fov, etc.) */
  camera?: {
    position?: [number, number, number];
    fov?: number;
    near?: number;
    far?: number;
  };
  /** Estilos del contenedor (por defecto llena al padre posicionado) */
  style?: React.CSSProperties;
  className?: string;
  /** Intensidad de luz ambiente */
  ambient?: number;
  /** Incluir Environment "city" para reflejos (metales/emisivos) */
  environment?: boolean;
}

/**
 * Wrapper compartido para todas las escenas 3D del sitio.
 * - dpr acotado y canvas transparente
 * - pausa el render loop cuando la sección sale del viewport
 * - luces base consistentes entre secciones
 */
export default function SceneCanvas({
  children,
  camera = { position: [0, 1.5, 5], fov: 42 },
  style,
  className,
  ambient = 0.7,
  environment = true,
}: SceneCanvasProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setMounted(true);
        setVisible(entry.isIntersecting);
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className={className}
      style={{ position: "absolute", inset: 0, ...style }}
    >
      {mounted && (
        <Canvas
          camera={camera}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true }}
          frameloop={visible ? "always" : "never"}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={ambient} />
          <directionalLight position={[4, 6, 4]} intensity={1.1} />
          <directionalLight position={[-4, 3, -3]} intensity={0.35} color="#88aaff" />
          {environment && <Environment preset="city" />}
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      )}
    </div>
  );
}
