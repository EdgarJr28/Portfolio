"use client";

import SceneCanvas from "@/components/three/SceneCanvas";
import HookAvatarScene from "@/components/three/scenes/HookAvatarScene";

/** Canvas decorativo de Skills: el avatar lanzando un gancho en loop. */
export default function SkillsLabCanvas() {
  return (
    <SceneCanvas camera={{ position: [0, 0.5, 2.4], fov: 42 }} ambient={0.75}>
      <HookAvatarScene />
    </SceneCanvas>
  );
}
