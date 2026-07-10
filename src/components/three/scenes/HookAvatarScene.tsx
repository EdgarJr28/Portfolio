"use client";

import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "../useReducedMotion";

// Horneado en Blender: avatar lanzando un gancho (hook) en loop continuo.
// El clip ya cierra perfecto (misma pose en el primer y último frame),
// no necesitó el proceso de continuidad de root motion que usamos en el Hero.
const AVATAR_URL = "/models/skills-hook.glb";

export default function HookAvatarScene() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(AVATAR_URL, true);
  const { actions } = useAnimations(animations, group);
  const reduced = useReducedMotion();

  useEffect(() => {
    const action = actions["Animation"] ?? Object.values(actions)[0];
    if (!action) return;

    if (reduced) {
      // Sin loop: se queda en la pose inicial
      action.play();
      action.paused = true;
    } else {
      action.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.4).play();
    }

    return () => {
      action.fadeOut(0.2);
    };
  }, [actions, reduced]);

  return (
    <group position={[0, -0.9, 0]}>
      <primitive ref={group} object={scene} />
    </group>
  );
}

useGLTF.preload(AVATAR_URL, true);
