"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

// ─── Configuración del modelo ─────────────────────────────────────────────────
// Cambia este valor por tu URL de ReadyPlayerMe o la ruta a tu .glb local:
//   ReadyPlayerMe:  "https://models.readyplayer.me/TU_ID.glb"
//   Local:          "/models/avatar.glb"
const MODEL_URL = "/models/avatar.glb";

// Ajusta estos valores según tu modelo
const MODEL_SCALE = 2.2;          // Tamaño general
const MODEL_POSITION: [number, number, number] = [0.8, -2.2, 0]; // [x, y, z] — desplaza a la derecha

// ─── Mouse compartido (evita re-renders) ─────────────────────────────────────
const mouse = { x: 0, y: 0 };

// ─── Esfera wireframe de fondo ────────────────────────────────────────────────
function WireframeSphere({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current || reducedMotion) return;
    ref.current.rotation.y += dt * 0.035;
    ref.current.rotation.x += dt * 0.015;
  });
  return (
    <mesh ref={ref} scale={3.5}>
      <icosahedronGeometry args={[1, 1]} />
      <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.035} />
    </mesh>
  );
}

// ─── Fallback geométrico mientras carga el .glb ───────────────────────────────
function LoadingShape() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.6;
  });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[1.2, 0]} />
      <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.1} wireframe />
    </mesh>
  );
}

// ─── Modelo GLTF animado ──────────────────────────────────────────────────────
function AvatarModel({
  reducedMotion,
  isMobile,
}: {
  reducedMotion: boolean;
  isMobile: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions, names } = useAnimations(animations, group);
  const smooth = useRef({ x: 0, y: 0 });

  // Reproducir la primera animación disponible
  useEffect(() => {
    if (names.length === 0) return;
    const action = actions[names[0]];
    action?.reset().fadeIn(0.6).play();
    return () => { action?.fadeOut(0.3); };
  }, [actions, names]);

  // Rotación suave con el mouse
  useFrame((_, dt) => {
    if (!group.current || reducedMotion || isMobile) return;
    smooth.current.x += (mouse.x * 0.25 - smooth.current.x) * 0.06;
    smooth.current.y += (mouse.y * 0.08 - smooth.current.y) * 0.06;
    group.current.rotation.y = smooth.current.x;
    group.current.rotation.x = smooth.current.y;
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 1.2}
      floatIntensity={reducedMotion ? 0 : 0.4}
      rotationIntensity={0}
    >
      <primitive
        ref={group}
        object={scene}
        scale={MODEL_SCALE}
        position={isMobile ? [0, -2, 0] : MODEL_POSITION}
      />
    </Float>
  );
}

// Pre-carga el modelo para que Suspense sea instantáneo en navegaciones
useGLTF.preload(MODEL_URL);

// ─── Fallback mobile simple ───────────────────────────────────────────────────
function MobileShape({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current || reducedMotion) return;
    ref.current.rotation.y += dt * 0.18;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.15} />
    </mesh>
  );
}

// ─── Canvas principal ─────────────────────────────────────────────────────────
export default function HeroCanvas() {
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [modelReady, setModelReady] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onMq = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onMq);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const onMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);

    // Verificar si el archivo del modelo existe antes de intentar cargarlo
    fetch(MODEL_URL, { method: "HEAD" })
      .then((r) => { if (r.ok) setModelReady(true); })
      .catch(() => {});

    return () => {
      mq.removeEventListener("change", onMq);
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0.5, 5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{ position: "absolute", inset: 0, background: "transparent" }}
      shadows
    >
      {/* Iluminación optimizada para modelos de personaje */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[3, 5, 3]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#6688ff" />

      {/* Environment para reflejos (no visible, solo iluminación) */}
      <Environment preset="city" />

      {/* Esfera wireframe de fondo — siempre visible */}
      <WireframeSphere reducedMotion={reducedMotion} />

      {/* Modelo 3D con Suspense — fallback geométrico mientras carga */}
      {isMobile ? (
        <MobileShape reducedMotion={reducedMotion} />
      ) : modelReady ? (
        <Suspense fallback={<LoadingShape />}>
          <AvatarModel reducedMotion={reducedMotion} isMobile={isMobile} />
        </Suspense>
      ) : (
        // Placeholder hasta que el modelo esté disponible
        <LoadingShape />
      )}
    </Canvas>
  );
}
