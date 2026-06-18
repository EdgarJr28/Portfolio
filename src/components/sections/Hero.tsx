"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Canvas 3D — fondo absoluto */}
      <HeroCanvas />

      {/* Gradiente inferior para transición suave */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "200px",
          background:
            "linear-gradient(to bottom, transparent, #0a0a0a)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Contenido del Hero */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "0 clamp(1.25rem, 5vw, 3rem)",
          maxWidth: "700px",
        }}
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            fontWeight: 400,
            letterSpacing: "0.25em",
            color: "rgba(240,240,240,0.4)",
            textTransform: "uppercase",
            marginBottom: "1.25rem",
          }}
        >
          Frontend Developer
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 8vw, 7rem)",
            fontWeight: 700,
            color: "#f0f0f0",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Ed<br />Maldonado
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          style={{ display: "flex", gap: "1rem", marginTop: "2.5rem", flexWrap: "wrap" }}
        >
          <motion.a
            href="#projects"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("projects");
            }}
            whileHover={{ borderColor: "rgba(255,255,255,0.7)" }}
            style={{
              border: "1px solid rgba(255,255,255,0.25)",
              padding: "0.75rem 1.75rem",
              color: "#f0f0f0",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              fontWeight: 400,
              textDecoration: "none",
              letterSpacing: "0.04em",
              transition: "border-color 0.2s",
            }}
          >
            Ver proyectos
          </motion.a>

          <motion.a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("contact");
            }}
            whileHover={{ borderColor: "rgba(255,255,255,0.7)" }}
            style={{
              border: "1px solid rgba(255,255,255,0.25)",
              padding: "0.75rem 1.75rem",
              color: "#f0f0f0",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              fontWeight: 400,
              textDecoration: "none",
              letterSpacing: "0.04em",
              transition: "border-color 0.2s",
            }}
          >
            Contactar
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          style={{
            position: "absolute",
            bottom: "2.5rem",
            left: "clamp(1.25rem, 5vw, 3rem)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            color: "rgba(240,240,240,0.25)",
          }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            style={{
              width: "1px",
              height: "40px",
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)",
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
      </div>
    </section>
  );
}
