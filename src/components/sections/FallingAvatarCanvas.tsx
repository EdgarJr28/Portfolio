"use client";

import SceneCanvas from "@/components/three/SceneCanvas";
import FallingAvatarScene from "@/components/three/scenes/FallingAvatarScene";
import { useIsMobile } from "@/components/three/useIsMobile";

/** Canvas del easter egg del nombre: avatar cayendo en loop, a todo el ancho del modal. */
export default function FallingAvatarCanvas() {
  const isMobile = useIsMobile();
  return (
    <SceneCanvas
      camera={isMobile
        ? { position: [0, -4, 2], fov: 50, near: 1.1, far: 50 }
        : { position: [0, -2.5, 1.5], fov: 50 }}
      ambient={0.8}
    >
      <FallingAvatarScene />
    </SceneCanvas>
  );
}
