"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type MotionValue } from "motion/react";

const STEM = "#6b8c63";
const LEAF = "#7faa75";

// Mismos paths que antes — solo aumenté width/height para escalar al 1.35x

function Tulip({ hue, uid }: { hue: string; uid: string }) {
  const g1 = `tg1-${uid}`;
  const g2 = `tg2-${uid}`;
  return (
    <svg width="48" height="110" viewBox="0 0 36 82" fill="none" overflow="visible">
      <defs>
        <linearGradient id={g1} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="100%" stopColor={hue} />
        </linearGradient>
        <linearGradient id={g2} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={hue} />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="100%" stopColor={hue} />
        </linearGradient>
      </defs>
      <path d="M18 34 L18 80" stroke={STEM} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M18 52 C12 50 7 52 6 58 C8 55 12 54 18 55Z" fill={LEAF} opacity="0.85" />
      <path d="M18 62 C24 60 29 62 30 68 C28 65 24 64 18 65Z" fill={LEAF} opacity="0.78" />
      {/* Pétalo trasero */}
      <path
        d="M18 5 C11 5 8 15 9 23 C10 31 14 34 18 36 C22 34 26 31 27 23 C28 15 25 5 18 5Z"
        fill={hue}
        opacity="0.58"
      />
      {/* Pétalo izquierdo */}
      <path
        d="M13 9 C6 13 5 23 7 29 C9 34 13 36 16 36 C15 29 13 19 13 9Z"
        fill={`url(#${g1})`}
        opacity="0.94"
      />
      {/* Pétalo derecho */}
      <path
        d="M23 9 C30 13 31 23 29 29 C27 34 23 36 20 36 C21 29 23 19 23 9Z"
        fill={`url(#${g2})`}
        opacity="0.92"
      />
      {/* Brillo */}
      <path
        d="M15 13 C14 20 14 28 15 33"
        stroke="rgba(255,255,255,0.38)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function Carnation({ hue, uid }: { hue: string; uid: string }) {
  const g1 = `cg1-${uid}`;
  const g2 = `cg2-${uid}`;
  return (
    <svg width="68" height="118" viewBox="0 0 52 90" fill="none" overflow="visible">
      <defs>
        <radialGradient id={g1} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.52" />
          <stop offset="65%" stopColor={hue} />
          <stop offset="100%" stopColor={hue} stopOpacity="0.68" />
        </radialGradient>
        <radialGradient id={g2} cx="45%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.65" />
          <stop offset="100%" stopColor={hue} />
        </radialGradient>
      </defs>
      <path d="M26 30 L26 88" stroke={STEM} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M26 58 C18 56 13 58 12 64 C14 61 18 60 26 61Z" fill={LEAF} opacity="0.85" />
      {Array.from({ length: 10 }).map((_, i) => (
        <ellipse
          key={`op${i}`}
          cx="26" cy="20" rx="11" ry="16"
          fill={`url(#${g1})`}
          opacity={0.8}
          transform={`rotate(${(360 / 10) * i} 26 20)`}
        />
      ))}
      {Array.from({ length: 6 }).map((_, i) => (
        <ellipse
          key={`ip${i}`}
          cx="26" cy="20" rx="6.5" ry="10"
          fill={`url(#${g2})`}
          opacity={0.9}
          transform={`rotate(${(360 / 6) * i + 18} 26 20)`}
        />
      ))}
      <circle cx="26" cy="20" r="5.5" fill={`url(#${g2})`} />
      <circle cx="26" cy="19" r="2.5" fill="rgba(255,255,255,0.55)" />
    </svg>
  );
}

function Rose({ hue, uid }: { hue: string; uid: string }) {
  const g1 = `rg1-${uid}`;
  const g2 = `rg2-${uid}`;
  const cx = 22;
  const cy = 20;
  return (
    <svg width="58" height="118" viewBox="0 0 44 90" fill="none" overflow="visible">
      <defs>
        <radialGradient id={g1} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.52" />
          <stop offset="100%" stopColor={hue} />
        </radialGradient>
        <radialGradient id={g2} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={hue} />
          <stop offset="100%" stopColor="rgba(0,0,0,0.3)" stopOpacity="0.3" />
        </radialGradient>
      </defs>
      <path d="M22 38 L22 88" stroke={STEM} strokeWidth="2.5" strokeLinecap="round" />
      <path d="M22 56 C14 54 9 56 8 62 C10 59 14 58 22 59Z" fill={LEAF} opacity="0.85" />
      <path d="M22 68 C30 66 35 68 36 74 C34 71 30 70 22 71Z" fill={LEAF} opacity="0.78" />
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <ellipse key={`ro${i}`} cx={cx} cy={cy + 5} rx="10" ry="14"
          fill={`url(#${g2})`} opacity="0.68"
          transform={`rotate(${angle} ${cx} ${cy})`} />
      ))}
      {[36, 108, 180, 252, 324].map((angle, i) => (
        <ellipse key={`rm${i}`} cx={cx} cy={cy + 3} rx="8" ry="12"
          fill={`url(#${g1})`} opacity="0.86"
          transform={`rotate(${angle} ${cx} ${cy})`} />
      ))}
      {[18, 108, 198, 288].map((angle, i) => (
        <ellipse key={`ri${i}`} cx={cx} cy={cy + 1} rx="5" ry="8"
          fill={`url(#${g1})`} opacity="0.93"
          transform={`rotate(${angle} ${cx} ${cy})`} />
      ))}
      <circle cx={cx} cy={cy} r="6" fill={`url(#${g1})`} />
      <path
        d="M20 17 C19 19 19 22 21 24 C22 25 23 24 22 23 C21 21 20 18 20 17Z"
        fill="rgba(255,255,255,0.4)"
      />
    </svg>
  );
}

type FlowerType = "tulip" | "carnation" | "rose";

interface FlowerDef {
  type: FlowerType;
  hue: string;
  ml: number;
  mb: number;
  delay: number;
  scale: number;
}

// 12 flores — una por cada mensaje de amor, orden fijo izq→der
const BOUQUET: FlowerDef[] = [
  { type: "carnation", hue: "#f0d4dc", ml: 0,   mb: 4,  delay: 0.05, scale: 0.88 }, // 0
  { type: "tulip",     hue: "#e2909f", ml: -14, mb: 0,  delay: 0,    scale: 1.0  }, // 1
  { type: "rose",      hue: "#bf5a70", ml: -16, mb: 12, delay: 0.15, scale: 1.05 }, // 2
  { type: "carnation", hue: "#eab8c2", ml: -14, mb: 16, delay: 0.28, scale: 1.0  }, // 3
  { type: "tulip",     hue: "#d8b46a", ml: -14, mb: 18, delay: 0.38, scale: 1.0  }, // 4
  { type: "rose",      hue: "#cc6880", ml: -16, mb: 10, delay: 0.50, scale: 0.97 }, // 5
  { type: "carnation", hue: "#d4a96a", ml: -14, mb: 2,  delay: 0.62, scale: 0.95 }, // 6
  { type: "tulip",     hue: "#e2909f", ml: -14, mb: 0,  delay: 0.72, scale: 0.9  }, // 7
  { type: "carnation", hue: "#f3d9df", ml: -14, mb: 6,  delay: 0.08, scale: 0.85 }, // 8
  { type: "rose",      hue: "#d4607a", ml: -16, mb: 8,  delay: 0.82, scale: 0.88 }, // 9
  { type: "tulip",     hue: "#e8c4cc", ml: -14, mb: 4,  delay: 0.92, scale: 0.84 }, // 10
  { type: "carnation", hue: "#c86075", ml: -14, mb: 10, delay: 1.02, scale: 0.82 }, // 11
];

export default function Flowers({
  baseDelay = 0,
  parallaxX,
  parallaxY,
  onFlowerClick,
}: {
  baseDelay?: number;
  parallaxX?: MotionValue<number>;
  parallaxY?: MotionValue<number>;
  onFlowerClick?: (index: number) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [bouquetScale, setBouquetScale] = useState(1);

  useEffect(() => {
    const parent = wrapRef.current?.parentElement;
    if (!parent) return;
    // Ramo completo a escala 1 mide ~520px. Escala proporcional al ancho
    // del IE window para que siempre entre sin desbordar.
    const compute = (w: number) =>
      setBouquetScale(Math.min(1, Math.max(0.3, w / 520)));
    const obs = new ResizeObserver(([e]) => compute(e.contentRect.width));
    obs.observe(parent);
    compute(parent.clientWidth);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        bottom: "4%",
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "none",
      }}
    >
      <motion.div
        style={{
          x: parallaxX,
          y: parallaxY,
          scale: bouquetScale,
          transformOrigin: "bottom center",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        {BOUQUET.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 22, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: f.scale }}
            whileHover={{ y: -10 }}
            whileTap={{ scale: f.scale * 0.92, y: -4 }}
            transition={{ delay: baseDelay + f.delay, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onFlowerClick?.(i)}
            style={{
              marginLeft: i === 0 ? 0 : `${f.ml}px`,
              marginBottom: `${f.mb}px`,
              transformOrigin: "bottom center",
              cursor: "pointer",
              pointerEvents: "auto",
            }}
          >
            <motion.div
              animate={{ rotate: [0, 2, 0, -2, 0] }}
              transition={{
                delay: baseDelay + f.delay + 1,
                duration: 5 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ transformOrigin: "bottom center" }}
            >
              {f.type === "tulip" ? (
                <Tulip hue={f.hue} uid={`f${i}`} />
              ) : f.type === "rose" ? (
                <Rose hue={f.hue} uid={`f${i}`} />
              ) : (
                <Carnation hue={f.hue} uid={`f${i}`} />
              )}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
