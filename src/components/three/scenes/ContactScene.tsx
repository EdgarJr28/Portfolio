"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "../useReducedMotion";

const CONTACT_URL = "/models/contact.glb";

/** Diorama de la sección de contacto: personaje sentado sobre las cajas,
 * con lámpara de techo cálida y un idle de respiración en loop. */
const LAMP_BASE_INTENSITY = 6;

export default function ContactScene() {
  const rig = useRef<THREE.Group>(null);
  const lampLight = useRef<THREE.PointLight>(null);
  const { scene, animations } = useGLTF(CONTACT_URL, true);
  const { actions } = useAnimations(animations, rig);
  const reduced = useReducedMotion();
  const [lampPos, setLampPos] = useState<[number, number, number]>([0, 2, 0]);

  // Centrar el modelo en el origen, usando solo las cajas ("base") como
  // referencia — el bbox de toda la escena se estira por el cable de la
  // lámpara hacia arriba y corre el centro visual lejos de las cajas.
  const centered = useMemo(() => {
    const anchor = scene.getObjectByName("base") ?? scene;
    const box = new THREE.Box3().setFromObject(anchor);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
    return scene;
  }, [scene]);

  // Ubicar la luz en la posición real de la pantalla de la lámpara del GLB
  // (efecto, no useMemo: leer una posición world-space no es puro para render).
  useEffect(() => {
    const shade = centered.getObjectByName("lamp-shade");
    if (!shade) return;
    const pos = new THREE.Vector3();
    shade.getWorldPosition(pos);
    setLampPos([pos.x, pos.y, pos.z]);
  }, [centered]);

  useEffect(() => {
    const idle = actions["breathe_idle"];
    if (!idle) return;

    idle.setLoop(THREE.LoopRepeat, Infinity);
    if (reduced) {
      idle.play();
      idle.paused = true;
    } else {
      idle.reset().fadeIn(0.4).play();
    }

    return () => {
      idle.fadeOut(0.3);
    };
  }, [actions, reduced]);

  useFrame(({ clock }) => {
    if (reduced) return;
    const t = clock.elapsedTime;

    // Parpadeo sutil de foco, como un bombillo colgante
    if (lampLight.current) {
      const flicker =
        1 +
        Math.sin(t * 9.5) * 0.05 +
        Math.sin(t * 22.3) * 0.03 +
        (Math.sin(t * 61.7) > 0.92 ? -0.15 : 0);
      lampLight.current.intensity = LAMP_BASE_INTENSITY * flicker;
    }
  });

  return (
    <group ref={rig}>
      <primitive object={centered} />
      {/* Luz cálida de la lámpara de techo (la geometría de la pantalla viene en el GLB) */}
      <pointLight
        ref={lampLight}
        position={lampPos}
        intensity={LAMP_BASE_INTENSITY}
        color="#ffcf80"
        distance={9}
        decay={2}
      />
    </group>
  );
}

useGLTF.preload(CONTACT_URL);
