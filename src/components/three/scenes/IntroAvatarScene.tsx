"use client";

import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "../useReducedMotion";

// Horneado en Blender: caminar + saludo + reposo combinados en un único
// clip continuo (root motion incluido, sin cortes de posición entre tramos).
const AVATAR_URL = "/models/intro-avatar.glb";
const HOLD_FRAME_SECONDS = 144 / 30; // duración total horneada a 30fps

export default function IntroAvatarScene() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(AVATAR_URL, true);
  const { actions } = useAnimations(animations, group);
  const reduced = useReducedMotion();

  useEffect(() => {
    const action = actions["Animation"] ?? Object.values(actions)[0];
    if (!action) return;

    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;

    if (reduced) {
      action.play();
      action.time = HOLD_FRAME_SECONDS;
    } else {
      action.reset().fadeIn(0.3).play();
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
