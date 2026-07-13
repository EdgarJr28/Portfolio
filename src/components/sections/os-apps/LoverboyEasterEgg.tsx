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
const PHRASE = "Some people become a home, even after they leave.";
// Personalizá esto con el nombre/fecha reales — quedan como placeholder
// porque no los conozco.
const SIGNATURE = "M.";
const DATE_LABEL = "siempre";

/** Sobre cerrado, estilo carta antigua — ilustración propia (divs +
 * clip-path), no artwork de terceros. */
function ClosedEnvelope() {
  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: "180px", height: "116px", position: "relative" }}
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
          width: "min(360px, 82vw)",
          minHeight: "170px",
          padding: "2rem 1.75rem",
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
            fontSize: "clamp(1rem, 2.6vw, 1.2rem)",
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
                {DATE_LABEL}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Solapa del sobre, asomando debajo de la carta */}
      <div
        style={{
          width: "180px",
          height: "34px",
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
export default function LoverboyEasterEgg() {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

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

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    my.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
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

  // Máquina de escribir: arranca apenas se abre la carta, un caracter a la vez.
  useEffect(() => {
    if (!open) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(PHRASE.slice(0, i));
      if (i >= PHRASE.length) clearInterval(id);
    }, 42);
    return () => clearInterval(id);
  }, [open]);

  const typingDone = typed.length >= PHRASE.length;

  return (
    <motion.div
      onPointerMove={handlePointerMove}
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
        overflow: "hidden",
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

      {open && <Flowers baseDelay={0.3} parallaxX={flowersX} parallaxY={flowersY} />}

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
