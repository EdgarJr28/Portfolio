"use client";

import SceneCanvas from "@/components/three/SceneCanvas";
import ContactScene from "@/components/three/scenes/ContactScene";

/** Canvas decorativo de Contact: la isla flotante. */
export default function ContactIslandCanvas() {
  return (
    <SceneCanvas camera={{ position: [0, 3, 10], fov: 38 }} ambient={0.7}>
      <ContactScene />
    </SceneCanvas>
  );
}
