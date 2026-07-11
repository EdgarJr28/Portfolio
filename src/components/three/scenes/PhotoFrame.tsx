"use client";

import { useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "../useReducedMotion";

interface PhotoFrameProps {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
  bobOffset?: number;
  onClick?: () => void;
}

/** Marco de madera flotante con una foto adentro. */
export default function PhotoFrame({
  url,
  position,
  rotation = [0, 0, 0],
  width = 1.1,
  height = 1.4,
  bobOffset = 0,
  onClick,
}: PhotoFrameProps) {
  const texture = useTexture(url);
  const group = useRef<THREE.Group>(null);
  const basePos = useRef(position);
  const reduced = useReducedMotion();

  useFrame(({ clock }) => {
    if (!group.current || reduced) return;
    group.current.position.y =
      basePos.current[1] + Math.sin(clock.elapsedTime * 0.6 + bobOffset) * 0.05;
  });

  const border = 0.08;

  return (
    <group
      ref={group}
      position={position}
      rotation={rotation}
      onClick={
        onClick &&
        ((e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onClick();
        })
      }
      onPointerOver={() => {
        if (onClick) document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        if (onClick) document.body.style.cursor = "auto";
      }}
    >
      {/* Marco */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[width + border * 2, height + border * 2, 0.06]} />
        <meshStandardMaterial color="#3b2a1e" roughness={0.7} />
      </mesh>
      {/* Foto */}
      <mesh position={[0, 0, 0.015]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={texture} roughness={0.9} />
      </mesh>
    </group>
  );
}
