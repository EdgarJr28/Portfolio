"use client";

import { useMemo } from "react";
import { motion } from "motion/react";

interface Petal {
  startX: number;
  endX: number;
  size: number;
  duration: number;
  delay: number;
  hue: string;
  rotate: number;
}

const HUES = ["#eab8c2", "#e2909f", "#d8b46a", "#f3d9df"];

function seedPetals(count: number): Petal[] {
  return Array.from({ length: count }, (_, i) => ({
    startX: Math.random() * 100,
    endX: Math.random() * 100,
    size: Math.random() * 8 + 10,
    duration: Math.random() * 10 + 14,
    delay: i * 2.2 + Math.random() * 3,
    hue: HUES[i % HUES.length],
    rotate: Math.random() * 360,
  }));
}

/** Un pétalo suelto: gota asimétrica, silueta simple. */
function PetalShape({ size, hue }: { size: number; hue: string }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 20 24" fill="none">
      <path
        d="M10 0C15 4 20 10 15 18C13 22 7 22 5 18C0 10 5 4 10 0Z"
        fill={hue}
        opacity={0.85}
      />
    </svg>
  );
}

/**
 * Pétalos sueltos derivando despacio por la pantalla, de fondo — un detalle
 * ambiental, no interactivo, muy sutil (opacity baja, movimiento lento).
 */
export default function Petals() {
  const petals = useMemo(() => seedPetals(6), []);

  return (
    <div aria-hidden="true" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {petals.map((p, i) => (
        <motion.div
          key={i}
          initial={{ left: `${p.startX}%`, top: "-8%", opacity: 0, rotate: p.rotate }}
          animate={{
            left: `${p.endX}%`,
            top: "110%",
            opacity: [0, 0.6, 0.6, 0],
            rotate: p.rotate + 200,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ position: "absolute" }}
        >
          <PetalShape size={p.size} hue={p.hue} />
        </motion.div>
      ))}
    </div>
  );
}
