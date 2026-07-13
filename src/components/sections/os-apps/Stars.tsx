"use client";

import { useMemo } from "react";
import { motion, type MotionValue } from "motion/react";

interface Star {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface Particle {
  x: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
}

function seedStars(count: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.6 + 0.6,
    duration: Math.random() * 3 + 2.5,
    delay: Math.random() * 4,
  }));
}

function seedParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    size: Math.random() * 3 + 2,
    duration: Math.random() * 14 + 16,
    delay: Math.random() * 10,
    drift: (Math.random() - 0.5) * 40,
  }));
}

/**
 * Cielo nocturno de fondo: estrellitas titilando + partículas suaves
 * flotando hacia arriba (como motas de luz/polvo). `parallaxX/Y` son
 * MotionValues (ver LoverboyEasterEgg) para el desplazamiento sutil con el
 * mouse — más notorio en las estrellas (más "lejos") que en las partículas.
 */
export default function Stars({
  parallaxX,
  parallaxY,
}: {
  parallaxX?: MotionValue<number>;
  parallaxY?: MotionValue<number>;
}) {
  const stars = useMemo(() => seedStars(90), []);
  const particles = useMemo(() => seedParticles(14), []);

  return (
    <motion.div
      aria-hidden="true"
      style={{ position: "absolute", inset: "-3%", x: parallaxX, y: parallaxY }}
    >
      {stars.map((s, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.15, 0.95, 0.15] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: "50%",
            background: "#f5efe0",
            boxShadow: "0 0 4px rgba(245,239,224,0.8)",
          }}
        />
      ))}

      {particles.map((p, i) => (
        <motion.div
          key={`p-${i}`}
          initial={{ y: "108%", opacity: 0 }}
          animate={{ y: "-8%", opacity: [0, 0.5, 0.5, 0], x: [0, p.drift] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(216,180,106,0.55) 0%, rgba(216,180,106,0) 70%)",
            filter: "blur(0.5px)",
          }}
        />
      ))}
    </motion.div>
  );
}
