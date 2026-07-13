"use client";

import { useEffect, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "../useReducedMotion";
import { useIsMobile } from "../useIsMobile";

const ROOM_URL = "/models/room.glb";
const AVATAR_URL = "/models/avatar-typing.glb"; // Armature + model + halo, clip "typing"

// Mouse compartido a nivel de módulo (evita re-renders de React)
const mouse = { x: 0, y: 0 };

function Avatar() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(AVATAR_URL, true);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const action = Object.values(actions)[0];
    action?.reset().fadeIn(0.5).play();
    return () => {
      action?.fadeOut(0.3);
    };
  }, [actions]);

  return <primitive ref={group} object={scene} />;
}

function meshMaterialName(obj: THREE.Object3D): string | undefined {
  const mesh = obj as THREE.Mesh;
  if (!mesh.material) return undefined;
  return Array.isArray(mesh.material) ? undefined : mesh.material.name;
}

const SCREEN_NAMES = new Set(["desktop-plane-0", "desktop-plane-1"]);

function isInteractive(obj: THREE.Object3D) {
  return (
    obj.name === "frame-photo" ||
    meshMaterialName(obj) === "rm-paper" ||
    SCREEN_NAMES.has(obj.name)
  );
}

function Room({
  onFrameClick,
  onNoteClick,
  onScreenClick,
}: {
  onFrameClick?: () => void;
  onNoteClick?: () => void;
  onScreenClick?: () => void;
}) {
  const { scene } = useGLTF(ROOM_URL, true);

  return (
    <primitive
      object={scene}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        if (e.object.name === "frame-photo") {
          e.stopPropagation();
          onFrameClick?.();
        } else if (meshMaterialName(e.object) === "rm-paper") {
          e.stopPropagation();
          onNoteClick?.();
        } else if (SCREEN_NAMES.has(e.object.name)) {
          e.stopPropagation();
          onScreenClick?.();
        }
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        if (isInteractive(e.object)) document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    />
  );
}

/**
 * Diorama de la habitación con el avatar escribiendo en el escritorio.
 * Room + avatar vienen de Blender ya posicionados/orientados (misma
 * jerarquía original que se usaba antes del experimento con FBX).
 */
export default function RoomScene({
  onFrameClick,
  onNoteClick,
  onScreenClick,
}: {
  onFrameClick?: () => void;
  onNoteClick?: () => void;
  onScreenClick?: () => void;
}) {
  const rig = useRef<THREE.Group>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Parallax sutil con el mouse sobre el grupo completo
  useFrame(() => {
    if (!rig.current || reduced) return;
    const target = -Math.PI / 3 + mouse.x * 0.12;
    const targetX = mouse.y * 0.00;
    rig.current.rotation.y += (target - rig.current.rotation.y) * 0.05;
    rig.current.rotation.x += (targetX - rig.current.rotation.x) * 0.05;
  });

  // La cámara de AboutDeskCanvas siempre mira al origen (comportamiento por
  // defecto de R3F cuando no le damos `rotation`). El offset de desktop
  // ([2.8, -1.35, 0]) descentra el diorama a propósito hacia la derecha,
  // dejando hueco a la izquierda para el texto superpuesto — eso solo tiene
  // sentido en el layout overlay de desktop. En mobile el texto va debajo,
  // no encima, así que necesitamos el diorama centrado en el frame en vez
  // de corrido: este offset compensa la rotación del rig para que el
  // centro real del escritorio/avatar quede cerca del origen (a donde
  // apunta la cámara), sin importar el aspect ratio de la caja del canvas.
  const groupPosition: [number, number, number] = isMobile
    ? [-0.95, -1.1, -0.9]
    : [2.8, -1.35, 0];

  return (
    <group position={groupPosition} scale={0.92}>
      {/* Rotación base -60°: muestra el rincón en 3/4 con el avatar de frente */}
      <group ref={rig} rotation={[0, -Math.PI / 3, 0]}>
        {/* El diorama vive descentrado en coords de Blender; se recentra aquí */}
        <group position={[1.4, 0, -0.4]}>
          <Room
            onFrameClick={onFrameClick}
            onNoteClick={onNoteClick}
            onScreenClick={onScreenClick}
          />
          <Avatar />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(ROOM_URL, true);
useGLTF.preload(AVATAR_URL, true);
