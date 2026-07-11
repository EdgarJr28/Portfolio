"use client";

import { useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "../useReducedMotion";

const TREE_COUNT = 15;

// PRNG determinista (mulberry32): misma semilla → mismo bosque siempre,
// para que los árboles no salten de posición en cada recarga.
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface TreeSpec {
  x: number;
  z: number;
  scale: number;
  hue: number;
}

function Tree({ x, z, scale, hue }: TreeSpec) {
  const color = useMemo(() => new THREE.Color().setHSL(hue, 0.35, 0.22), [hue]);
  return (
    <group position={[x, 0, z]} scale={scale}>
      {/* Tronco */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.06, 0.09, 0.8, 6]} />
        <meshStandardMaterial color="#4a3728" roughness={0.9} />
      </mesh>
      {/* Follaje (3 conos apilados) */}
      <mesh position={[0, 1.0, 0]}>
        <coneGeometry args={[0.55, 0.9, 7]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.45, 0]}>
        <coneGeometry args={[0.42, 0.75, 7]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.85, 0]}>
        <coneGeometry args={[0.28, 0.6, 7]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
    </group>
  );
}

// Layout fijo (semilla constante) generado una sola vez a nivel de módulo.
// Los marcos viven en z entre -0.8 y -1.9: los árboles arrancan detrás de
// ese límite (z <= -2.8) para no taparlos nunca, sin importar el ángulo.
const TREES: TreeSpec[] = (() => {
  const rand = mulberry32(1337);
  const arr: TreeSpec[] = [];
  for (let i = 0; i < TREE_COUNT; i++) {
    const x = (rand() - 0.5) * 20;
    const depth = rand(); // 0 = justo detrás de los marcos, 1 = fondo
    const z = -2.8 - depth * 10; // -2.8 a -12.8
    arr.push({
      x,
      z,
      // Los árboles más cercanos (menor profundidad) son más grandes
      scale: 1.1 - depth * 0.5 + rand() * 0.2,
      hue: 0.28 + rand() * 0.08,
    });
  }
  // Ordenar de más lejos a más cerca (z más negativo primero)
  arr.sort((a, b) => a.z - b.z);
  return arr;
})();

function Trees() {
  const trees = TREES;

  return (
    <>
      {trees.map((t, i) => (
        <Tree key={i} {...t} />
      ))}
    </>
  );
}

interface FlySpec {
  x: number;
  y: number;
  z: number;
  speed: number;
  offset: number;
}

const FLIES: FlySpec[] = (() => {
  const rand = mulberry32(7331);
  return Array.from({ length: 14 }, () => ({
    x: (rand() - 0.5) * 6,
    y: 0.3 + rand() * 1.4,
    z: (rand() - 0.5) * 4 - 1,
    speed: 0.3 + rand() * 0.4,
    offset: rand() * Math.PI * 2,
  }));
})();

function Fireflies() {
  const group = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();
  const flies = FLIES;

  useFrame(({ clock }) => {
    if (!group.current || reduced || flies.length === 0) return;
    const t = clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const f = flies[i];
      child.position.set(
        f.x + Math.sin(t * f.speed + f.offset) * 0.4,
        f.y + Math.sin(t * f.speed * 1.5 + f.offset) * 0.2,
        f.z + Math.cos(t * f.speed + f.offset) * 0.4
      );
      const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      mat.opacity = 0.4 + Math.sin(t * 3 + f.offset) * 0.35;
    });
  });

  return (
    <group ref={group}>
      {flies.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshBasicMaterial color="#f5e79a" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// Textura procedural con cráteres (canvas), generada una sola vez.
// Le da "forma" real a la luna sin romper la silueta redonda.
function makeMoonTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Base cálida tipo "luna de lobo"
  ctx.fillStyle = "#efe2b8";
  ctx.fillRect(0, 0, size, size);

  const rand = mulberry32(2024);
  // Manchas grandes tipo "mares" lunares
  for (let i = 0; i < 7; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 18 + rand() * 34;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, "rgba(150,130,90,0.35)");
    grad.addColorStop(1, "rgba(150,130,90,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // Cráteres pequeños con borde
  for (let i = 0; i < 40; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const r = 2 + rand() * 7;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(120,102,70,0.28)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.9, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,248,220,0.25)";
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function Moon({ onClick }: { onClick?: () => void }) {
  const moonMap = useMemo(() => makeMoonTexture(), []);

  return (
    <group
      position={[4.5, 3.6, -15]}
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
      {/* Halo suave (sin fog, sin depthWrite, para simular un glow sin postproceso) */}
      <mesh>
        <sphereGeometry args={[2.6, 20, 20]} />
        <meshBasicMaterial
          color="#f6d9a0"
          transparent
          opacity={0.09}
          fog={false}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.95, 20, 20]} />
        <meshBasicMaterial
          color="#f6d9a0"
          transparent
          opacity={0.16}
          fog={false}
          depthWrite={false}
        />
      </mesh>
      {/* Disco de la luna llena, con cráteres */}
      <mesh>
        <sphereGeometry args={[1.6, 48, 48]} />
        <meshStandardMaterial
          map={moonMap}
          emissive="#f3dfa5"
          emissiveMap={moonMap}
          emissiveIntensity={0.55}
          roughness={1}
          fog={false}
        />
      </mesh>
    </group>
  );
}

/** Bosque de bajo poligonaje: fondo decorativo para la sección Blog. */
export default function ForestScene({
  onMoonClick,
}: {
  onMoonClick?: () => void;
}) {
  return (
    <>
      <fog attach="fog" args={["#0d1710", 4, 15]} />
      <ambientLight intensity={0.25} color="#8fb89a" />
      {/* Luz principal con más contraste, para que el follaje tenga cara clara/oscura */}
      <directionalLight position={[3, 6, 2]} intensity={1.1} color="#dff0d0" />
      {/* Contraluz cálida detrás de los árboles: separa las siluetas de la niebla */}
      <directionalLight position={[-2, 2.5, -8]} intensity={0.7} color="#ffb066" />
      {/* Luz de luna: cálida, sutil, desde la dirección de la luna */}
      <directionalLight position={[4.5, 3.6, -15]} intensity={0.3} color="#f3dfa5" />

      <Moon onClick={onMoonClick} />

      {/* Piso: dos discos concéntricos para insinuar profundidad/gradiente */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -1.5]}>
        <circleGeometry args={[15, 32]} />
        <meshStandardMaterial color="#0e1a10" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -1.5]}>
        <circleGeometry args={[4, 32]} />
        <meshStandardMaterial color="#22331f" roughness={1} />
      </mesh>

      <Trees />
      <Fireflies />
    </>
  );
}
