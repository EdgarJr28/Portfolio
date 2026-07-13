"use client";

import { motion, type MotionValue } from "motion/react";

const STEM_GREEN = "#7c9473"; // sage green

/** Un tulipán simple: tallo + copa de 3 pétalos superpuestos. */
function Tulip({ hue }: { hue: string }) {
  return (
    <svg width="34" height="70" viewBox="0 0 34 70" fill="none">
      <path d="M17 30 L17 68" stroke={STEM_GREEN} strokeWidth="2" />
      <path d="M17 42 Q6 46 4 56" stroke={STEM_GREEN} strokeWidth="2" fill="none" />
      <path d="M17 46 Q28 50 30 60" stroke={STEM_GREEN} strokeWidth="2" fill="none" />
      <path
        d="M17 4 C9 4 6 14 8 22 C10 30 14 32 17 34 C20 32 24 30 26 22 C28 14 25 4 17 4Z"
        fill={hue}
      />
      <path
        d="M13 8 C9 12 8 19 10 25 C11 29 13 31 15 32 C13 26 12 16 13 8Z"
        fill="rgba(0,0,0,0.08)"
      />
    </svg>
  );
}

/** Un clavel: círculo central rodeado de pétalos ondulados (rizados), la
 * silueta clásica del clavel. */
function Carnation({ hue }: { hue: string }) {
  const petals = Array.from({ length: 8 });
  return (
    <svg width="46" height="80" viewBox="0 0 46 80" fill="none">
      <path d="M23 26 L23 78" stroke={STEM_GREEN} strokeWidth="2" />
      <path d="M23 50 Q13 54 10 64" stroke={STEM_GREEN} strokeWidth="2" fill="none" />
      <g>
        {petals.map((_, i) => {
          const angle = (360 / petals.length) * i;
          return (
            <ellipse
              key={i}
              cx="23"
              cy="20"
              rx="9"
              ry="13"
              fill={hue}
              opacity={0.92}
              transform={`rotate(${angle} 23 20)`}
            />
          );
        })}
        <circle cx="23" cy="20" r="7" fill={hue} opacity={0.6} />
      </g>
    </svg>
  );
}

// Paleta: blush pink, oro apagado, rosa suave — tonos cálidos, nada
// saturado, coherente con ivory/beige/sage/midnight del resto de la escena.
const BOUQUET = [
  { type: "tulip", hue: "#e2909f", x: -70, delay: 0 },
  { type: "carnation", hue: "#f3d9df", x: -32, delay: 0.15 },
  { type: "tulip", hue: "#d8b46a", x: 4, delay: 0.3 },
  { type: "carnation", hue: "#eab8c2", x: 40, delay: 0.45 },
  { type: "tulip", hue: "#e2909f", x: 74, delay: 0.6 },
] as const;

/**
 * Un ramo de claveles y tulipanes, sutil — florecen uno por uno con un
 * fundido suave y un pequeño balanceo continuo, sin exagerar. Ilustración
 * propia (formas simples con SVG), no artwork de terceros. `parallaxX/Y`
 * son MotionValues opcionales para el desplazamiento sutil con el mouse.
 */
export default function Flowers({
  baseDelay = 0,
  parallaxX,
  parallaxY,
}: {
  baseDelay?: number;
  parallaxX?: MotionValue<number>;
  parallaxY?: MotionValue<number>;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        bottom: "6%",
        left: "50%",
        transform: "translateX(-50%)",
        pointerEvents: "none",
      }}
    >
    <motion.div
      style={{
        x: parallaxX,
        y: parallaxY,
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      {BOUQUET.map((f, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 18, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: baseDelay + f.delay,
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ position: "relative", marginLeft: i === 0 ? 0 : "-6px" }}
        >
          <motion.div
            animate={{ rotate: [0, 1.5, 0, -1.5, 0] }}
            transition={{
              delay: baseDelay + f.delay + 0.9,
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "bottom center" }}
          >
            {f.type === "tulip" ? <Tulip hue={f.hue} /> : <Carnation hue={f.hue} />}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
    </div>
  );
}
