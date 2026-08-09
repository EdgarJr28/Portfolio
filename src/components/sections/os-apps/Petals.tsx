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
  opacity: number;
}

const HUES = ["#eab8c2", "#e2909f", "#d8b46a", "#f3d9df", "#cc6880", "#f0c8d0"];

function seedPetals(count: number): Petal[] {
  return Array.from({ length: count }, (_, i) => ({
    startX: Math.random() * 100,
    endX: Math.random() * 100,
    size: Math.random() * 10 + 9,
    duration: Math.random() * 12 + 16,
    delay: i * 1.4 + Math.random() * 2.5,
    hue: HUES[i % HUES.length],
    rotate: Math.random() * 360,
    opacity: Math.random() * 0.35 + 0.45,
  }));
}

function PetalShape({ size, hue, uid }: { size: number; hue: string; uid: string }) {
  const gid = `pg-${uid}`;
  return (
    <svg width={size} height={size * 1.3} viewBox="0 0 20 26" fill="none">
      <defs>
        <radialGradient id={gid} cx="40%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="100%" stopColor={hue} />
        </radialGradient>
      </defs>
      <path
        d="M10 0C15 4 20 11 15 19C13 23 7 23 5 19C0 11 5 4 10 0Z"
        fill={`url(#${gid})`}
      />
    </svg>
  );
}

export default function Petals() {
  const petals = useMemo(() => seedPetals(16), []);

  return (
    <div
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}
    >
      {petals.map((p, i) => (
        <motion.div
          key={i}
          initial={{ left: `${p.startX}%`, top: "-8%", opacity: 0, rotate: p.rotate }}
          animate={{
            left: `${p.endX}%`,
            top: "110%",
            opacity: [0, p.opacity, p.opacity, 0],
            rotate: p.rotate + 240,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ position: "absolute" }}
        >
          <PetalShape size={p.size} hue={p.hue} uid={`${i}`} />
        </motion.div>
      ))}
    </div>
  );
}
