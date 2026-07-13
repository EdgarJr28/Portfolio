"use client";

import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "../useReducedMotion";
import { is } from "@react-three/fiber/dist/declarations/src/core/utils";
import { useIsMobile } from "../useIsMobile";

// Horneado en Blender: dos clips separados — "intro" (caminar + saludo,
// se reproduce una sola vez) e "idle" (parado con maletín, hecho para
// loopear indefinidamente al terminar el saludo).
const AVATAR_URL = "/models/intro-avatar.glb";

export default function IntroAvatarScene() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(AVATAR_URL, true);
  const { actions } = useAnimations(animations, group);
  const reduced = useReducedMotion();

  useEffect(() => {
    const intro = actions["intro"];
    const idle = actions["briefcase_idle"];
    if (!intro || !idle) return;

    intro.setLoop(THREE.LoopOnce, 1);
    intro.clampWhenFinished = true;
    idle.setLoop(THREE.LoopRepeat, Infinity);

    if (reduced) {
      // Pose estática de reposo, sin animar (nada de loop para motion reducido).
      idle.play();
      idle.paused = true;
    } else {
      intro.reset().fadeIn(0.3).play();
      const mixer = intro.getMixer();
      const onFinished = (e: { action: THREE.AnimationAction }) => {
        if (e.action !== intro) return;
       /*  idle.reset().fadeIn(0.4).play(); */
      };
      mixer.addEventListener("finished", onFinished);
      return () => {
        mixer.removeEventListener("finished", onFinished);
        intro.fadeOut(0.2);
        idle.fadeOut(0.2);
      };
    }

    return () => {
      intro.fadeOut(0.2);
      idle.fadeOut(0.2);
    };
  }, [actions, reduced]);
  const isMobile = useIsMobile();
  return (
    <group position={isMobile ? [-0, -2, -2] : [0, -0.9, 0]} scale={isMobile ? 1.4 : 1.1}>
      <primitive ref={group} object={scene} />
    </group>
  );
}

useGLTF.preload(AVATAR_URL, true);
