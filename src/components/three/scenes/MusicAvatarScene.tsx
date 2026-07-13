"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Text } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "../useReducedMotion";
import { useIsMobile } from "@/components/three/useIsMobile";

// Horneado en Blender: mesh+esqueleto con dos clips ("music" y "standing"),
// ambos cierran en loop perfecto (mismo hips en el primer/último frame).
const AVATAR_URL = "/models/spotify-avatar.glb";

const NOTE_SYMBOLS = ["♪", "♫", "♩", "♬"];

function MusicNotes({ active }: { active: boolean }) {
  const group = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();

  const notes = useMemo(
    () =>
      NOTE_SYMBOLS.map((symbol, i) => ({
        symbol,
        angle: (i / NOTE_SYMBOLS.length) * Math.PI * 2,
        radius: 0.85 + (i % 2) * 0.15,
        speed: 0.5 + i * 0.12,
        bobOffset: i * 1.3,
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!group.current || reduced) return;
    const t = clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const n = notes[i];
      const angle = n.angle + t * n.speed * 0.4;
      child.position.x = Math.cos(angle) * n.radius;
      child.position.z = Math.sin(angle) * n.radius;
      child.position.y = 1.5 + Math.sin(t * 1.2 + n.bobOffset) * 0.15;
    });
  });

  return (
    <group ref={group} visible={active}>
      {notes.map((n, i) => (
        <Text
          key={i}
          fontSize={0.22}
          color="#f5d442"
          anchorX="center"
          anchorY="middle"
        >
          {n.symbol}
        </Text>
      ))}
    </group>
  );
}

/**
 * Avatar riggeado escuchando música. Cuando hay canción sonando reproduce
 * "music" (baila); en reposo se queda quieto en su pose base (sin animación),
 * de pie mirando al frente. Notas musicales flotan alrededor solo mientras suena.
 */
export default function MusicAvatarScene({ playing }: { playing: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(AVATAR_URL, true);
  const { actions } = useAnimations(animations, group);
  const reduced = useReducedMotion();
    const isMobile = useIsMobile();
  useEffect(() => {
    const action = playing && !reduced ? actions["music"] : null;
    action?.reset().fadeIn(0.4).play();
    return () => {
      action?.fadeOut(0.3);
    };
  }, [actions, playing, reduced]);

  return (
    // agregar un grupo para poder mover el avatar y las notas juntas para movil y desktop
    <group position={isMobile ? [-0.6, -.85, 0] : [-0.55, -0.95, 0]} scale={0.68}>
      <primitive ref={group} object={scene} />
      <MusicNotes active={playing && !reduced} />
    </group>
  );
}

useGLTF.preload(AVATAR_URL, true);
