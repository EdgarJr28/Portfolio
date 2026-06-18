"use client";

import { motion } from "motion/react";
import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";

const SECTION_STYLE = {
  padding: "160px clamp(1.25rem, 5vw, 3rem)",
  maxWidth: "1200px",
  margin: "0 auto",
};

export default function About() {
  return (
    <section id="about" style={SECTION_STYLE}>
      <SectionTitle number="01" title="About" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 400px), 1fr))",
          gap: "clamp(2rem, 6vw, 5rem)",
          alignItems: "center",
        }}
      >
        {/* Texto */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1rem, 2vw, 1.125rem)",
              fontWeight: 300,
              color: "rgba(240,240,240,0.7)",
              lineHeight: 1.9,
              marginBottom: "2.5rem",
            }}
          >
            Frontend developer con pasión por construir interfaces rápidas,
            accesibles y visualmente memorables. Especializado en React y
            Next.js, con foco en rendimiento y experiencia de usuario.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <InfoRow label="Ubicación" value="Barranquilla, Colombia" />
            <InfoRow label="Email" value="ed.dev28@gmail.com" />
            <InfoRow label="Experiencia" value="5+ años" />
            <InfoRow label="Disponibilidad" value="Abierto a oportunidades" />
          </div>
        </motion.div>

        {/* Imagen / Avatar */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
          style={{
            position: "relative",
            aspectRatio: "4 / 5",
            maxHeight: "520px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Usa /images/me.jpg si existe, o el placeholder de fondo */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              src="/images/developer_banner.jpg"
              alt="Ed Maldonado"
              fill
              style={{ objectFit: "cover", objectPosition: "center top" }}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={false}
            />
          </div>

          {/* Overlay sutil con gradiente */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, transparent 60%, rgba(10,10,10,0.4))",
              pointerEvents: "none",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "baseline",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        paddingBottom: "0.6rem",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.75rem",
          letterSpacing: "0.12em",
          color: "rgba(240,240,240,0.3)",
          textTransform: "uppercase",
          width: "100px",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.9rem",
          fontWeight: 300,
          color: "rgba(240,240,240,0.7)",
        }}
      >
        {value}
      </span>
    </div>
  );
}
