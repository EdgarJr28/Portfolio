"use client";

import SceneCanvas from "@/components/three/SceneCanvas";
import FallingAvatarScene from "@/components/three/scenes/FallingAvatarScene";

/** Canvas del easter egg del nombre: avatar cayendo en loop, a todo el ancho del modal. */
export default function FallingAvatarCanvas() {
  return (
    <SceneCanvas camera={{ position: [0, -2.5, 1.5], fov: 50 }} ambient={0.8}>
      <FallingAvatarScene />
    </SceneCanvas>
  );
}
