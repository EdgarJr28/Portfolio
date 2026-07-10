"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "../useReducedMotion";

const CONTACT_URL = "/models/contact.glb";

/** Isla flotante de la sección de contacto, con balanceo suave. */
export default function ContactScene() {
  const rig = useRef<THREE.Group>(null);
  const { scene } = useGLTF(CONTACT_URL);
  const reduced = useReducedMotion();

  // Centrar el modelo en el origen (viene descentrado del export)
  const centered = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
    return scene;
  }, [scene]);

  useFrame(({ clock }) => {
    if (!rig.current || reduced) return;
    const t = clock.elapsedTime;
    rig.current.rotation.y = Math.sin(t * 0.25) * 0.25;
    rig.current.position.y = Math.sin(t * 0.8) * 0.12;
    rig.current.rotation.z = Math.sin(t * 0.5) * 0.03;
  });

  return (
    <group ref={rig}>
      <primitive object={centered} />
    </group>
  );
}

useGLTF.preload(CONTACT_URL);
