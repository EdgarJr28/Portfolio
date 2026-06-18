"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

// Spline — solo desktop, carga diferida para no bloquear LCP
const HeroSpline = dynamic(() => import("./HeroSpline"), {
  ssr: false,
  loading: () => null,
});

// Canvas Three.js — fallback en mobile y mientras carga Spline
const HeroCanvas = dynamic(() => import("./HeroCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const [splineLoaded, setSplineLoaded] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "grid",
        // Desktop: dos columnas. Mobile: una columna
        gridTemplateColumns: "1fr",
        overflow: "hidden",
      }}
    >
      {/* ── Desktop: layout split ── */}
      <div
        className="hidden md:grid"
        style={{
          gridTemplateColumns: "1fr 1fr",
          minHeight: "100vh",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* Columna izquierda — texto */}
        <TextContent scrollTo={scrollTo} />

        {/* Columna derecha — escena Spline */}
        <div
          style={{
            position: "relative",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* Canvas Three.js visible hasta que Spline cargue */}
          <AnimatePresence>
            {!splineLoaded && (
              <motion.div
                key="canvas-fallback"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                style={{ position: "absolute", inset: 0 }}
              >
                <HeroCanvas />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Spline — se muestra al terminar de cargar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: splineLoaded ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            style={{ position: "absolute", inset: 0 }}
          >
            <HeroSpline onLoad={() => setSplineLoaded(true)} />
          </motion.div>

          {/* Gradiente izquierdo para fusionar con el texto */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              width: "120px",
              background:
                "linear-gradient(to right, #0a0a0a, transparent)",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
        </div>
      </div>

      {/* ── Mobile: texto centrado + canvas de fondo ── */}
      <div
        className="md:hidden"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Canvas Three.js como fondo en mobile */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <HeroCanvas />
        </div>

        {/* Gradiente encima del canvas */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.7) 100%)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* Texto centrado en mobile */}
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 1.5rem" }}>
          <TextContent scrollTo={scrollTo} centered />
        </div>
      </div>

      {/* Gradiente inferior (ambos layouts) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "160px",
          background: "linear-gradient(to bottom, transparent, #0a0a0a)",
          pointerEvents: "none",
          zIndex: 3,
        }}
      />
    </section>
  );
}

// ─── Contenido de texto (compartido entre mobile y desktop) ──────────────────
function TextContent({
  scrollTo,
  centered = false,
}: {
  scrollTo: (id: string) => void;
  centered?: boolean;
}) {
  return (
    <div
      style={{
        padding: "0 clamp(1.5rem, 5vw, 4rem)",
        textAlign: centered ? "center" : "left",
      }}
    >
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.75rem",
          fontWeight: 400,
          letterSpacing: "0.28em",
          color: "rgba(240,240,240,0.4)",
          textTransform: "uppercase",
          marginBottom: "1.25rem",
        }}
      >
        Frontend Developer
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.75rem, 7vw, 6.5rem)",
          fontWeight: 700,
          color: "#f0f0f0",
          lineHeight: 0.95,
          letterSpacing: "-0.03em",
          margin: 0,
          marginBottom: "2.5rem",
        }}
      >
        Ed<br />Maldonado
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        style={{
          display: "flex",
          gap: "0.875rem",
          justifyContent: centered ? "center" : "flex-start",
          flexWrap: "wrap",
        }}
      >
        <GhostButton
          onClick={() => scrollTo("projects")}
          label="Ver proyectos"
        />
        <GhostButton
          onClick={() => scrollTo("contact")}
          label="Contactar"
        />
      </motion.div>

      {/* Indicador de scroll — solo en desktop (no centrado) */}
      {!centered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginTop: "5rem",
            color: "rgba(240,240,240,0.2)",
          }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            style={{
              width: "1px",
              height: "36px",
              background: "linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.6875rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Scroll
          </span>
        </motion.div>
      )}
    </div>
  );
}

function GhostButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ borderColor: "rgba(255,255,255,0.65)" }}
      style={{
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.25)",
        padding: "0.7rem 1.6rem",
        color: "#f0f0f0",
        fontFamily: "var(--font-body)",
        fontSize: "0.875rem",
        fontWeight: 400,
        letterSpacing: "0.04em",
        cursor: "pointer",
        transition: "border-color 0.2s",
      }}
    >
      {label}
    </motion.button>
  );
}
