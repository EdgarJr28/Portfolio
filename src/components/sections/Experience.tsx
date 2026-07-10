"use client";

import { motion } from "motion/react";
import SectionTitle from "@/components/ui/SectionTitle";
import { experiences } from "@/lib/data";

const SECTION_STYLE = {
  padding: "160px clamp(1.25rem, 5vw, 3rem)",
  maxWidth: "1200px",
  margin: "0 auto",
};

// Más antiguo → actual (los datos vienen ordenados al revés)
const timeline = [...experiences].reverse();

export default function Experience() {
  return (
    <section id="experience" style={SECTION_STYLE}>
      <SectionTitle number="03" title="Experience" />

      <div
        style={{
          position: "relative",
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          gap: "3rem",
          paddingTop: "1.5rem",
          paddingBottom: "1rem",
          scrollSnapType: "x proximity",
        }}
      >
        {/* Línea horizontal */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "calc(1.5rem + 7px)",
            height: "1px",
            background: "rgba(255,255,255,0.07)",
          }}
        />

        {timeline.map((exp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, delay: i * 0.08 }}
            style={{
              position: "relative",
              paddingTop: "2.5rem",
              flex: "1 1 0",
              minWidth: "220px",
              scrollSnapAlign: "start",
            }}
          >
            {/* Punto circular */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "1.5rem",
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.25)",
                background: "#0a0a0a",
                zIndex: 1,
              }}
            />

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                color: "rgba(240,240,240,0.3)",
                textTransform: "uppercase",
                marginBottom: "0.35rem",
              }}
            >
              {exp.period}
            </p>

            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.1rem, 2.5vw, 1.375rem)",
                fontWeight: 700,
                color: "#f0f0f0",
                letterSpacing: "-0.01em",
                marginBottom: "0.2rem",
              }}
            >
              {exp.role}
            </h3>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.875rem",
                fontWeight: 400,
                color: "rgba(240,240,240,0.4)",
                marginBottom: "1rem",
              }}
            >
              {exp.company}
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {exp.bullets.map((bullet, bi) => (
                <li
                  key={bi}
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "flex-start",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    fontWeight: 300,
                    color: "rgba(240,240,240,0.55)",
                    lineHeight: 1.65,
                    marginBottom: "0.35rem",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.18)", flexShrink: 0 }}>
                    —
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
