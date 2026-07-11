"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import ForestScene from "./ForestScene";
import PhotoFrame from "./PhotoFrame";
import { useReducedMotion } from "../useReducedMotion";

export type FrameKey = "randoms" | "vibes" | "nature";

// Se usa solo si una carpeta está vacía y no hay portada real que mostrar.
const FALLBACK_COVER = "/images/projects_galery/belena.png";

// Mouse compartido a nivel de módulo (evita re-renders de React)
const mouse = { x: 0, y: 0 };

interface BlogForestSceneProps {
  covers: Record<FrameKey, string | undefined>;
  onFrameClick?: (key: FrameKey) => void;
  onMoonClick?: () => void;
}

/** Bosque con 3 marcos flotantes mostrando fotos y una luna clickeable. */
export default function BlogForestScene({
  covers,
  onFrameClick,
  onMoonClick,
}: BlogForestSceneProps) {
  const rig = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // El parallax de mouse + una deriva lenta constante son la señal de
  // profundidad más fuerte para una escena procedural sin sombras reales.
  useFrame(({ clock }) => {
    if (!rig.current || reduced) return;
    const drift = Math.sin(clock.elapsedTime * 0.08) * 0.06;
    const target = drift + mouse.x * 0.18;
    const targetX = mouse.y * 0.05;
    rig.current.rotation.y += (target - rig.current.rotation.y) * 0.04;
    rig.current.rotation.x += (targetX - rig.current.rotation.x) * 0.04;
  });

  return (
    <group ref={rig}>
      <ForestScene onMoonClick={onMoonClick} />
      <PhotoFrame
        url={covers.randoms ?? FALLBACK_COVER}
        position={[-2.6, 1.1, -0.8]}
        rotation={[0, 0.4, 0]}
        width={1.3}
        height={1.6}
        bobOffset={0}
        onClick={onFrameClick && (() => onFrameClick("randoms"))}
      />
      <PhotoFrame
        url={covers.vibes ?? FALLBACK_COVER}
        position={[0, 1.2, -1.9]}
        rotation={[0, 0, 0]}
        width={1.3}
        height={1.6}
        bobOffset={2.1}
        onClick={onFrameClick && (() => onFrameClick("vibes"))}
      />
      <PhotoFrame
        url={covers.nature ?? FALLBACK_COVER}
        position={[2.6, 1.1, -0.8]}
        rotation={[0, -0.4, 0]}
        width={1.3}
        height={1.6}
        bobOffset={4.2}
        onClick={onFrameClick && (() => onFrameClick("nature"))}
      />
    </group>
  );
}
