"use client";

import SceneCanvas from "@/components/three/SceneCanvas";
import ContactScene from "@/components/three/scenes/ContactScene";

/** Canvas decorativo de Contact: el diorama de las cajas. */
export default function ContactIslandCanvas() {
  return (
    <SceneCanvas camera={{ position: [4.27, 0.76, 8.29], fov: 38 }} ambient={0.35}>
      <ContactScene />
    </SceneCanvas>
  );
}
