"use client";

import { motion } from "motion/react";
import SceneCanvas from "@/components/three/SceneCanvas";
import IntroAvatarScene from "@/components/three/scenes/IntroAvatarScene";

/** Canvas del Hero: el avatar entra caminando y saluda (sin fondo propio). */
export default function HeroIntroCanvas() {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <SceneCanvas
        camera={{ position: [0, 1.1, 5.6], fov: 38 }}
        ambient={0.8}
        environment={false}
      >
        <IntroAvatarScene />
      </SceneCanvas>

      {/* Fundido oscuro: oculta el "pop-in" inicial del modelo/T-pose */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.6, delay: 1.1, ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset: 0,
          background: "#0a0a0a",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
