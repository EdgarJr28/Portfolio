"use client";

import Spline from "@splinetool/react-spline";

// ─── URL de tu escena Spline ───────────────────────────────────────────────────
// Cómo obtenerla:
//   1. spline.design → abre tu escena (o una de la Community)
//   2. Menú Export → "Viewer" → copia la URL del tipo:
//      https://prod.spline.design/XXXXXXXXXX/scene.splinecode
//   3. Pégala aquí ↓
const SPLINE_URL = "https://prod.spline.design/your-scene-id-here/scene.splinecode";

interface HeroSplineProps {
  onLoad?: () => void;
}

export default function HeroSpline({ onLoad }: HeroSplineProps) {
  return (
    <Spline
      scene={SPLINE_URL}
      onLoad={onLoad}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}
