# Plan de Modernización — Portfolio (EdgarJr28/Portfolio)

## Contexto

**Stack actual detectado (package.json):**
- Next.js 14.2.4 (App Router, `src/app/`)
- React 18
- Tailwind CSS 3.4.1 (`tailwind.config.ts`)
- TypeScript 5, ESLint 8 (`.eslintrc.json`)
- styled-components 6.1.11
- AOS (scroll-reveal), @tsparticles (fondo de partículas)
- react-slick + slick-carousel (carrusel de proyectos)
- @alptugidin/react-circular-progress-bar (barras de skills)
- FontAwesome (iconos)
- nodemailer (formulario de contacto), spotify-web-api-node (widget "now playing"),
  @react-google-maps/api + @vis.gl/react-google-maps (mapa)
- @vercel/analytics — desplegado en Vercel
- react-router-dom (no debería ser necesario en App Router — revisar uso real)

**Stack objetivo (junio 2026):**
- Next.js 16.2.x LTS (Turbopack por defecto, Node 20+)
- React 19
- Tailwind CSS v4.3 (configuración 100% en CSS vía `@theme`, sin `tailwind.config.js`)
- ESLint 9 (flat config) + eslint-config-next 16
- three.js + @react-three/fiber v9 + @react-three/drei v10 → capa 3D/WebGL
- Lenis → scroll suave
- `motion` (antes "Framer Motion", ahora paquete independiente, import desde `motion/react`)

## Cómo usar este documento

Pega este archivo en la raíz del repo y ve pidiéndole a Claude Code que ejecute
cada bloque en orden. Cada bloque termina con `npm run build` para confirmar que
no se rompió nada antes de seguir al siguiente. Idealmente, un commit por bloque.

---

## Bloque 0 — Preparación

- [x] Crear rama: `git checkout -b feature/modernizacion-2026`
- [x] Confirmar Node ≥ 20: `node -v`
- [x] Respaldar `tailwind.config.ts` y `.eslintrc.json` (se van a reemplazar)

---

## Bloque 1 — Next.js 14 → 16 + React 19

- [x] Ejecutar el codemod oficial: `npx @next/codemod@canary upgrade latest`
- [x] Instalar React 19 explícitamente:
  ```bash
  npm install react@19 react-dom@19
  npm install -D @types/react@19 @types/react-dom@19
  ```
- [x] Revisar `next.config.mjs`: eliminar flags experimentales que ya quedaron
  estables o se removieron entre Next 14 y 16
- [x] Revisar cualquier uso síncrono de `cookies()`, `headers()` o `params` —
  en Next 16 estas APIs son **async-only**
- [x] `npm run build` y resolver errores de tipos que aparezcan

## Bloque 2 — ESLint 8 → 9 (flat config)

- [x] `npm install -D eslint@9 eslint-config-next@16`
- [x] Eliminar `.eslintrc.json`, crear `eslint.config.mjs`:
  ```js
  import { dirname } from "path";
  import { fileURLToPath } from "url";
  import { FlatCompat } from "@eslint/eslintrc";

  const compat = new FlatCompat({
    baseDirectory: dirname(fileURLToPath(import.meta.url)),
  });

  export default [...compat.extends("next/core-web-vitals", "next/typescript")];
  ```

## Bloque 3 — Tailwind v3 → v4

- [x] Ejecutar el codemod oficial: `npx @tailwindcss/upgrade`
- [x] Eliminar `tailwind.config.ts`. Mover tokens de diseño a `globals.css`:
  ```css
  @import "tailwindcss";

  @theme {
    --color-brand: #6366f1;
    --font-display: "Inter", sans-serif;
  }
  ```
- [x] Reemplazar `postcss.config.mjs`:
  ```js
  const config = {
    plugins: { "@tailwindcss/postcss": {} },
  };
  export default config;
  ```
- [x] El codemod migra solo la mayoría de clases renombradas
  (ej. `bg-gradient-to-r` → `bg-linear-to-r`); revisar visualmente los gradientes

## Bloque 4 — Limpieza de dependencias redundantes

- [x] Confirmar si `react-router-dom` realmente se usa en algún lado. Si no,
  eliminarlo (el App Router de Next ya cubre el ruteo vía `next/link` /
  `next/navigation`)
- [x] Migrar estilos de `styled-components` a clases Tailwind / variables CSS.
  Tener dos sistemas de estilo en paralelo no aporta nada y complica los
  Server Components
- [x] Revisar si el paquete `again` (versión 0.0.1) se usa de verdad; si no,
  eliminarlo
- [x] `npm uninstall react-router-dom styled-components again` (según lo que
  confirmes arriba)

## Bloque 5 — Capa 3D/WebGL (el cambio visual principal)

- [ ] Instalar:
  ```bash
  npm install three @react-three/fiber@^9 @react-three/drei@^10
  npm install -D @types/three
  ```
- [ ] Crear `src/components/Hero3D.tsx`:
  ```tsx
  "use client";

  import { Canvas, useFrame } from "@react-three/fiber";
  import { Float, MeshDistortMaterial } from "@react-three/drei";
  import { useRef } from "react";
  import * as THREE from "three";

  function FloatingShape() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((_, delta) => {
      if (meshRef.current) {
        meshRef.current.rotation.x += delta * 0.15;
        meshRef.current.rotation.y += delta * 0.2;
      }
    });

    return (
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.4, 1]} />
          <MeshDistortMaterial
            color="#6366f1"
            distort={0.35}
            speed={2}
            roughness={0.2}
            metalness={0.6}
          />
        </mesh>
      </Float>
    );
  }

  export default function Hero3D() {
    return (
      <div className="absolute inset-0 -z-10">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 5, 5]} intensity={1.2} />
          <FloatingShape />
        </Canvas>
      </div>
    );
  }
  ```
- [ ] Cargarlo de forma diferida en `app/page.tsx` (WebGL nunca debe romper el
  render del servidor ni bloquear el LCP):
  ```tsx
  import dynamic from "next/dynamic";

  const Hero3D = dynamic(() => import("@/components/Hero3D"), {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-zinc-950 to-zinc-900" />
    ),
  });
  ```
- [ ] Reemplazar el fondo actual de `@tsparticles` por esta escena — no conviene
  correr dos motores de canvas distintos al mismo tiempo, afecta el rendimiento
- [ ] Respetar accesibilidad: si `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
  es `true`, desactivar la rotación/flotación automática
- [ ] En móviles, considera ocultar el Canvas o mostrar una versión estática —
  WebGL en gama baja puede ser costoso

## Bloque 6 — Scroll suave y micro-interacciones

- [ ] `npm install lenis motion`
- [ ] Crear un `SmoothScrollProvider` (client component) que envuelva el layout
  y configure Lenis
- [ ] Sustituir `aos` por `motion/react` con `whileInView` en las secciones de
  scroll-reveal (mismo efecto, una sola librería de animación en todo el sitio)
- [ ] `npm uninstall aos @types/aos @tsparticles/engine @tsparticles/react @tsparticles/slim`

## Bloque 7 — Pulido de componentes existentes (opcional, recomendado)

- [ ] Carrusel de proyectos: `react-slick`/`slick-carousel` arrastran CSS de
  estilo jQuery-era; considera Embla Carousel o un grid con scroll-snap +
  `motion` para algo más liviano y "pro"
- [ ] Barras de progreso de skills: opcional, se puede reemplazar
  `@alptugidin/react-circular-progress-bar` por un SVG animado con `motion`
  para control total del diseño
- [ ] Iconos: FontAwesome está bien tal cual; si buscas algo más minimalista,
  `lucide-react` pesa menos en el bundle

## Bloque 8 — Confirmar que las integraciones que SÍ se quedan sigan funcionando

- [ ] Formulario de contacto (`nodemailer`): confirmar que vive en un Route
  Handler (`app/api/contact/route.ts`) y sigue funcionando bajo Turbopack
- [ ] Widget de Spotify (`spotify-web-api-node`): mantenerlo, es un detalle
  diferenciador
- [ ] Google Maps: mantener si se usa para mostrar ubicación; si no se usa en
  ningún lado visible, eliminar para reducir el bundle

## Bloque 9 — QA y despliegue

- [ ] Lighthouse / Core Web Vitals — el canvas WebGL puede dañar LCP/TBT si no
  se cargó en lazy correctamente
- [ ] Probar en un celular real (no solo DevTools) — el 3D suele necesitar una
  versión simplificada en pantallas pequeñas o gama baja
- [ ] Confirmar que el proyecto en Vercel usa Node ≥ 20
- [ ] Merge a `master` y deploy
