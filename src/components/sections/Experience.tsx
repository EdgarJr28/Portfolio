"use client";

import { motion } from "motion/react";
import SectionTitle from "@/components/ui/SectionTitle";
import { useLang } from "@/context/LangContext";
import { t } from "@/lib/i18n";

const SECTION_STYLE = {
  padding: "160px clamp(1.25rem, 5vw, 3rem)",
  maxWidth: "1200px",
  margin: "0 auto",
};

const TIMELINE_CSS = `
.exp-scroll {
  overflow-x: hidden;
  overflow-y: hidden;
}
@media (min-width: 768px) {
  .exp-scroll {
    overflow-x: auto;
    padding-bottom: 1rem;
    scroll-snap-type: x proximity;
  }
}
.exp-list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2.75rem;
  width: 100%;
}
@media (min-width: 768px) {
  .exp-list {
    flex-direction: row;
    gap: 3rem;
    padding-top: 1.5rem;
    min-width: var(--exp-minw);
  }
}
.exp-line {
  position: absolute;
  left: 7px;
  top: 0.2rem;
  bottom: 0.2rem;
  width: 1px;
  background: rgba(255, 255, 255, 0.07);
}
@media (min-width: 768px) {
  .exp-line {
    left: 0;
    right: 0;
    top: calc(1.5rem + 7px);
    bottom: auto;
    width: auto;
    height: 1px;
  }
}
.exp-item {
  position: relative;
  padding-left: 2.5rem;
}
@media (min-width: 768px) {
  .exp-item {
    padding-left: 0;
    padding-top: 2.5rem;
    flex: 1 1 0;
    min-width: 220px;
    scroll-snap-align: start;
  }
}
.exp-dot {
  position: absolute;
  left: 0;
  top: 0.15rem;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: #0a0a0a;
  z-index: 1;
}
@media (min-width: 768px) {
  .exp-dot {
    top: 1.5rem;
  }
}
`;

export default function Experience() {
  const { lang } = useLang();
  const timeline = [...t.experience.entries[lang]].reverse();

  return (
    <section id="experience" style={SECTION_STYLE}>
      <style>{TIMELINE_CSS}</style>
      <SectionTitle number="03" title="Experience" />

      <div className="exp-scroll">
        <div
          className="exp-list"
          style={
            {
              "--exp-minw": `${timeline.length * 220 + (timeline.length - 1) * 48}px`,
            } as React.CSSProperties
          }
        >
          <div aria-hidden="true" className="exp-line" />

          {timeline.map((exp, i) => (
            <motion.div
              key={i}
              className="exp-item"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: i * 0.08 }}
            >
              <div aria-hidden="true" className="exp-dot" />

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
      </div>
    </section>
  );
}
