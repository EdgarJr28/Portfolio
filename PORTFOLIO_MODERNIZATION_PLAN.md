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

- [x] Instalar:
  ```bash
  npm install three @react-three/fiber@^9 @react-three/drei@^10
  npm install -D @types/three
  ```
- [x] Crear `src/components/Hero3D.tsx`:
- [x] Cargarlo de forma diferida en `app/page.tsx` (WebGL nunca debe romper el
  render del servidor ni bloquear el LCP)
- [x] Reemplazar el fondo actual de `@tsparticles` por esta escena — no conviene
  correr dos motores de canvas distintos al mismo tiempo, afecta el rendimiento
- [x] Respetar accesibilidad: si `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
  es `true`, desactivar la rotación/flotación automática
- [x] En móviles, considera ocultar el Canvas o mostrar una versión estática —
  WebGL en gama baja puede ser costoso

## Bloque 6 — Scroll suave y micro-interacciones

- [x] `npm install lenis motion`
- [x] Crear un `SmoothScrollProvider` (client component) que envuelva el layout
  y configure Lenis
- [x] Sustituir `aos` por `motion/react` con `whileInView` en las secciones de
  scroll-reveal (mismo efecto, una sola librería de animación en todo el sitio)
- [x] `npm uninstall aos @types/aos @tsparticles/engine @tsparticles/react @tsparticles/slim`

## Bloque 7 — Pulido de componentes existentes (opcional, recomendado)

- [x] Carrusel de proyectos: reemplazado react-slick por scroll-snap nativo + motion + dots/nav
- [x] Barras de progreso de skills: reemplazado @alptugidin/react-circular-progress-bar por SkillRing SVG + motion/useInView
- [x] Iconos: FontAwesome se mantiene (no requiere cambios)

## Bloque 8 — Confirmar que las integraciones que SÍ se quedan sigan funcionando

- [x] Formulario de contacto (`nodemailer`): vive en Route Handler `/api/sendEmail/route.ts`, usa `Request` + `NextResponse` — compatible con Turbopack/Next 16
- [x] Widget de Spotify: routes `/api/current-track` y `/api/playlist` correctos; SpotifyCard reescrito para React 19
- [x] Google Maps: `MapV2` activo en ContactSection; advertencia "Map ID" es configuración de Google Cloud, no un bug de código. Import muerto `Map` eliminado.

## Bloque 9 — QA y despliegue

- [x] Lighthouse / Core Web Vitals — Hero3D se carga con `dynamic({ ssr: false })`, oculto en mobile, reduced-motion respetado
- [x] Probar en celular real — Hero3D hidden en mobile (`hidden mdsm:block`); verificar manualmente
- [x] Node ≥ 20 confirmado localmente (v25.9.0); `engines.node: ">=20"` añadido a package.json para Vercel
- [x] Limpieza final: eliminar Map.tsx legacy + desinstalar @react-google-maps/api (sustituido por @vis.gl/react-google-maps)
- [ ] Merge a `master` y deploy (acción manual del usuario)
