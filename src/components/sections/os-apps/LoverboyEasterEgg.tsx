"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import Stars from "./Stars";
import Petals from "./Petals";
import Flowers from "./Flowers";

const AUDIO_SRC = "/sounds/os/virginia-beach.mp3";
const PHRASE = "No sé por que mientras hago todo esto te sigo teniendo en mi cabeza, eres la mujer que más he amado nunca, si algun dia ves esto recuerda que te amare toda mi vida.";
const SIGNATURE = "Ed.";

const LOVE_MESSAGES = [
  "Tus ojos son de las pocas cosas que no puedo dejar de recordar. Hay algo en ellos que siempre me delató.",
  "Tu risa hace que el ruido del mundo desaparezca. No sé si lo sabes, pero es verdad.",
  "Me enseñaste sin querer que amar de verdad se siente como llegar a casa.",
  "Si pudiera volver atrás, te elegiría a ti. En cada versión de esta historia.",
  "Eres más hermosa de lo que crees. Y lo creo cada vez que cierro los ojos.",
  "Contigo aprendí que el amor más honesto no grita. Simplemente está.",
  "Hay canciones que solo tienen sentido cuando pienso en ti.",
  "Nadie me ha hecho reír tanto ni extrañar tan profundo. Eso vale oro.",
  "Te amo de la única manera que sé hacerlo: con todo lo que tengo.",
  "Ojalá encuentres alguien que te quiera la mitad de lo que yo te quiero. Serías la persona más feliz del mundo.",
  "Cambiaste algo en mí sin intentarlo. Eso es lo más poderoso que alguien puede hacer.",
  "Donde sea que estés, hay alguien en este mundo que piensa en ti todos los días. Siempre seré yo.",
] as const;

/** Sobre cerrado, estilo carta antigua — ilustración propia (divs +
 * clip-path), no artwork de terceros. */
function ClosedEnvelope() {
  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: "min(180px, 46%)", aspectRatio: "180 / 116", position: "relative" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "4px",
          background: "linear-gradient(180deg, #e7c9a9 0%, #d9b48f 100%)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.55), 0 0 40px rgba(216,180,106,0.15)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, transparent 49%, rgba(0,0,0,0.1) 50%, transparent 51%), linear-gradient(45deg, transparent 49%, rgba(0,0,0,0.1) 50%, transparent 51%)",
          borderRadius: "4px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "58%",
          background: "linear-gradient(180deg, #dfb488 0%, #cf9f6d 100%)",
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
        }}
      />
    </motion.div>
  );
}

/** La carta abierta: papel con textura sutil, borde redondeado, sombra
 * cálida — el texto se escribe con efecto máquina de escribir. */
function OpenLetter({ typed, showSignature }: { typed: string; showSignature: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          width: "min(360px, 90%)",
          minHeight: "clamp(130px, 25%, 170px)",
          padding: "clamp(1rem, 5%, 2rem) clamp(0.875rem, 5%, 1.75rem)",
          borderRadius: "10px",
          textAlign: "center",
          background:
            "radial-gradient(ellipse at 50% 25%, #fffdf7 0%, #f7edd9 55%, #efe0c0 100%)",
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(120,90,50,0.025) 0px, rgba(120,90,50,0.025) 1px, transparent 1px, transparent 3px), radial-gradient(ellipse at 50% 25%, #fffdf7 0%, #f7edd9 55%, #efe0c0 100%)",
          boxShadow:
            "0 24px 60px rgba(0,0,0,0.55), 0 0 70px rgba(216,180,106,0.18), inset 0 0 30px rgba(180,140,80,0.08)",
        }}
      >
        <p
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontStyle: "italic",
            fontSize: "clamp(0.875rem, 1.8vmin, 1.15rem)",
            color: "#4a3a2c",
            lineHeight: 1.7,
            margin: 0,
            minHeight: "3.4em",
          }}
        >
          {typed}
          {typed.length < PHRASE.length && (
            <span style={{ opacity: 0.5 }}>▏</span>
          )}
        </p>

        <AnimatePresence>
          {showSignature && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginTop: "1.4rem" }}
            >
              <p
                style={{
                  fontFamily: "'Brush Script MT', 'Segoe Script', cursive",
                  fontSize: "1.5rem",
                  color: "#9c7a3f",
                  margin: 0,
                }}
              >
                — {SIGNATURE}
              </p>
              <p
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "0.68rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(74,58,44,0.45)",
                  margin: "0.3rem 0 0",
                }}
              >
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Solapa del sobre, asomando debajo de la carta */}
      <div
        style={{
          width: "min(180px, 46%)",
          height: "clamp(24px, 6%, 34px)",
          marginTop: "-6px",
          background: "linear-gradient(180deg, #d9b48f 0%, #cf9f6d 100%)",
          borderRadius: "0 0 4px 4px",
          boxShadow: "0 8px 18px rgba(0,0,0,0.4)",
        }}
      />
    </div>
  );
}

/**
 * Easter egg del "buscador fake": buscar "maited" activa esta escena
 * cinemática — cielo nocturno con estrellas y partículas (con parallax al
 * mover el mouse), un sobre que se abre revelando una carta con textura de
 * papel y efecto máquina de escribir, firma + fecha, un ramo de flores que
 * florece detrás y pétalos sueltos derivando por la pantalla. Música
 * ("Virginia Beach" — el archivo hay que agregarlo a mano en
 * public/sounds/os/virginia-beach.mp3, no lo podemos generar acá) arranca
 * durante el fundido inicial. Todo dentro de la misma ventana del navegador
 * falso, sin saltos bruscos.
 */
interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  type: "trail" | "heart";
  dx: number;
  dy: number;
}

const PARTICLE_COLORS = ["#eab8c2", "#e2909f", "#f3d9df", "#cc6880", "#d8b46a", "#ffecf0"];

export default function LoverboyEasterEgg() {
  const [open, setOpen] = useState(false);
  const [displayPhrase, setDisplayPhrase] = useState(PHRASE);
  const [typed, setTyped] = useState("");
  const [particles, setParticles] = useState<Particle[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const pidRef = useRef(0);
  const lastTrailRef = useRef(0);

  // Parallax suave: la posición del mouse dentro de la ventana mueve
  // levemente las estrellas (más) y las flores (menos), como capas a
  // distinta profundidad.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springCfg = { stiffness: 45, damping: 20, mass: 0.6 };
  const starsX = useSpring(useTransform(mx, [-1, 1], [-16, 16]), springCfg);
  const starsY = useSpring(useTransform(my, [-1, 1], [-12, 12]), springCfg);
  const flowersX = useSpring(useTransform(mx, [-1, 1], [-6, 6]), springCfg);
  const flowersY = useSpring(useTransform(my, [-1, 1], [-4, 4]), springCfg);

  const spawnTrail = (x: number, y: number) => {
    const now = Date.now();
    if (now - lastTrailRef.current < 85) return;
    lastTrailRef.current = now;
    const id = pidRef.current++;
    setParticles((p) => [
      ...p.slice(-22),
      { id, x, y, color: PARTICLE_COLORS[id % PARTICLE_COLORS.length], type: "trail", dx: 0, dy: 0 },
    ]);
    setTimeout(() => setParticles((p) => p.filter((q) => q.id !== id)), 1300);
  };

  const spawnHearts = (x: number, y: number) => {
    const burst = Array.from({ length: 7 }, (_, i) => {
      const id = pidRef.current++;
      const angle = ((360 / 7) * i) * (Math.PI / 180);
      return {
        id,
        x: x + (Math.random() - 0.5) * 14,
        y,
        color: PARTICLE_COLORS[id % PARTICLE_COLORS.length],
        type: "heart" as const,
        dx: Math.cos(angle) * (38 + Math.random() * 28),
        dy: Math.sin(angle) * (38 + Math.random() * 28) - 22,
      };
    });
    setParticles((p) => [...p.slice(-30), ...burst]);
    burst.forEach((b) =>
      setTimeout(() => setParticles((p) => p.filter((q) => q.id !== b.id)), 1900)
    );
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    my.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
    spawnTrail(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    spawnHearts(e.clientX - rect.left, e.clientY - rect.top);
  };

  useEffect(() => {
    const openTimer = setTimeout(() => setOpen(true), 2200);
    const audioTimer = setTimeout(() => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.volume = 0.45;
      audio.play().catch(() => {});
    }, 700);
    return () => {
      clearTimeout(openTimer);
      clearTimeout(audioTimer);
    };
  }, []);

  // Máquina de escribir: se reinicia cada vez que displayPhrase cambia.
  useEffect(() => {
    if (!open) return;
    setTyped("");
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(displayPhrase.slice(0, i));
      if (i >= displayPhrase.length) clearInterval(id);
    }, 38);
    return () => clearInterval(id);
  }, [open, displayPhrase]);

  const handleFlowerClick = (index: number) => {
    setDisplayPhrase(LOVE_MESSAGES[index]);
  };

  const typingDone = typed.length >= displayPhrase.length;

  return (
    <motion.div
      onPointerMove={handlePointerMove}
      onClick={handleClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, ease: "easeInOut" }}
      style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at 50% 40%, #141a2e 0%, #0b0e1a 70%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: "22%",
        overflow: "hidden",
        cursor: "url('/cursors/usagi.png') 24 24, auto",
      }}
    >
      <audio ref={audioRef} src={AUDIO_SRC} />

      <Stars parallaxX={starsX} parallaxY={starsY} />
      <Petals />

      {/* Luz ambiental cálida detrás de la carta */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: open ? 0.9 : 0.3 }}
        transition={{ duration: 1.8 }}
        style={{
          position: "absolute",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(216,180,106,0.35) 0%, rgba(216,180,106,0) 70%)",
          filter: "blur(10px)",
          pointerEvents: "none",
        }}
      />

      {open && (
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none" }}>
          <Flowers baseDelay={0.3} parallaxX={flowersX} parallaxY={flowersY} onFlowerClick={handleFlowerClick} />
        </div>
      )}

      {/* Trail + heart burst particles */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 10 }}>
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, y: 0, x: 0, scale: 1 }}
              animate={
                p.type === "trail"
                  ? { opacity: 0, y: -26, scale: 0.3 }
                  : { opacity: [1, 1, 0], y: p.dy, x: p.dx, scale: [1, 1.3, 0.5] }
              }
              exit={{ opacity: 0 }}
              transition={{ duration: p.type === "trail" ? 1.1 : 1.7, ease: "easeOut" }}
              style={{
                position: "absolute",
                left: p.x,
                top: p.y,
                translateX: "-50%",
                translateY: "-50%",
                pointerEvents: "none",
              }}
            >
              {p.type === "trail" ? (
                <svg width="7" height="7" viewBox="0 0 14 14">
                  <circle cx="7" cy="7" r="5" fill={p.color} opacity="0.72" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill={p.color}>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {!open ? (
            <motion.div
              key="closed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <ClosedEnvelope />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <OpenLetter typed={typed} showSignature={typingDone} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
