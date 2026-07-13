"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import NameEasterEggModal from "./NameEasterEggModal";

// Avatar 3D — carga diferida, sin SSR (WebGL solo en cliente)
const IntroCanvas = dynamic(() => import("./HeroIntroCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const [nameEggOpen, setNameEggOpen] = useState(false);
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
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Tope de ancho interno: en pantallas 2K/4K el texto quedaba pegado
          al borde izquierdo con medio monitor vacío en el medio. */}
      <div
        style={{
          display: "flex",
          width: "100%",
          maxWidth: "1700px",
          margin: "0 auto",
          alignItems: "center",
        }}
      >
        <div style={{ flex: 1 }}>
          <TextContent scrollTo={scrollTo} onNameClick={() => setNameEggOpen(true)} />
        </div>

        {/* Columna derecha — avatar 3D (oculto en mobile) */}
        <div
          className="hidden md:block"
          style={{
            flex: 1,
            position: "relative",
            height: "100vh",
            transform: "translateY(-50px)",
          }}
        >
          <IntroCanvas />
        </div>
      </div>

      {/* Gradiente inferior */}
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

      <NameEasterEggModal open={nameEggOpen} onClose={() => setNameEggOpen(false)} />
    </section>
  );
}

// ─── Contenido de texto (compartido entre mobile y desktop) ──────────────────
function TextContent({
  scrollTo,
  onNameClick,
  centered = false,
}: {
  scrollTo: (id: string) => void;
  onNameClick?: () => void;
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
        Developer
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
        {/* El easter egg solo se activa clickeando "Edgar" — no en
            "Maldonado" ni en el espacio vacío del resto del heading. */}
        <span
          onClick={onNameClick}
          data-cursor-hover
          style={{ cursor: onNameClick ? "pointer" : undefined }}
        >
          Edgar
        </span>
        <br />
        Maldonado
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
        <Button onClick={() => scrollTo("projects")}>Ver proyectos</Button>
        <Button onClick={() => scrollTo("contact")}>Contactar</Button>
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
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.35), transparent)",
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
