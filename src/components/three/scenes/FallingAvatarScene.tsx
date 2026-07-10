"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "../useReducedMotion";

// Horneado en Blender: mesh+esqueleto con el clip "falling", cierra en loop
// perfecto (mismo hips en el primer/último frame).
const AVATAR_URL = "/models/falling-avatar.glb";

const STAR_COUNT = 420;
const STREAK_COUNT = 22;

function Stars() {
  const points = useRef<THREE.Points>(null);
  const reduced = useReducedMotion();

  const positions = useMemo(() => new Float32Array(STAR_COUNT * 3), []);

  // Posiciones aleatorias en un efecto (no durante el render)
  useEffect(() => {
    for (let i = 0; i < STAR_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    if (points.current) {
      points.current.geometry.attributes.position.needsUpdate = true;
    }
  }, [positions]);

  useFrame(({ clock }) => {
    if (!points.current) return;
    const mat = points.current.material as THREE.PointsMaterial;
    if (!reduced) {
      mat.opacity = 0.55 + Math.sin(clock.elapsedTime * 1.4) * 0.25;
    }
    points.current.rotation.y += reduced ? 0 : 0.0006;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.035}
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  );
}

/** Rachas de "brisa" — líneas que suben rápido alrededor del personaje,
 * dando sensación de velocidad de caída. */
function WindStreaks() {
  const group = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();

  const streaks = useMemo(
    () =>
      Array.from({ length: STREAK_COUNT }, () => ({
        x: 0,
        y: 0,
        z: 0,
        length: 1,
        speed: 1,
      })),
    []
  );

  const randomize = (s: (typeof streaks)[number], startY?: number) => {
    s.x = (Math.random() - 0.5) * 5.5;
    s.y = startY ?? -4 - Math.random() * 4;
    s.z = (Math.random() - 0.5) * 3 - 0.5;
    s.length = 0.35 + Math.random() * 0.5;
    s.speed = 3.5 + Math.random() * 3;
  };

  useEffect(() => {
    streaks.forEach((s) => randomize(s, -4 - Math.random() * 8));
  }, [streaks]);

  useFrame((_, delta) => {
    if (!group.current || reduced) return;
    group.current.children.forEach((child, i) => {
      const s = streaks[i];
      s.y += s.speed * delta;
      if (s.y > 4.5) randomize(s, -4.5);
      child.position.set(s.x, s.y, s.z);
      child.scale.set(1, s.length, 1);
    });
  });

  return (
    <group ref={group}>
      {streaks.map((_, i) => (
        <mesh key={i} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.012, 1]} />
          <meshBasicMaterial
            color="#cfe8ff"
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function FallingAvatarScene() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(AVATAR_URL, true);
  const { actions } = useAnimations(animations, group);
  const reduced = useReducedMotion();

  useEffect(() => {
    const action = actions["Animation"] ?? Object.values(actions)[0];
    if (!action) return;

    if (reduced) {
      action.play();
      action.paused = true;
    } else {
      action.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.4).play();
    }

    return () => {
      action.fadeOut(0.3);
    };
  }, [actions, reduced]);

  return (
    <>
      <Stars />
      <WindStreaks />
      {/* Ángulo bien bajo, mirando de abajo hacia arriba, rostro hacia la cámara */}
      <group position={[-0.64, -1.2, -0.2]} rotation={[0.55, 0.2, 0.03]}>
        <primitive ref={group} object={scene} />
      </group>
    </>
  );
}

useGLTF.preload(AVATAR_URL, true);
