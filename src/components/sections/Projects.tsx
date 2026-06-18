"use client";

import { motion } from "motion/react";
import SectionTitle from "@/components/ui/SectionTitle";
import { projects, type Project } from "@/lib/data";

const SECTION_STYLE = {
  padding: "160px clamp(1.25rem, 5vw, 3rem)",
  maxWidth: "1200px",
  margin: "0 auto",
};

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: (index % 2) * 0.1 }}
      style={{
        border: "1px solid rgba(255,255,255,0.07)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Imagen / placeholder */}
      <div
        style={{
          position: "relative",
          aspectRatio: "16 / 9",
          background: "#111111",
          overflow: "hidden",
        }}
      >
        <motion.div
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Placeholder con nombre del proyecto */}
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              fontWeight: 800,
              color: "rgba(255,255,255,0.04)",
              letterSpacing: "-0.03em",
              textAlign: "center",
              padding: "0 1rem",
            }}
          >
            {project.title}
          </span>
        </motion.div>

        {/* Overlay sutil al hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255,255,255,0.02)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Contenido */}
      <div
        style={{
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          flex: 1,
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.125rem",
            fontWeight: 700,
            color: "#f0f0f0",
            letterSpacing: "-0.01em",
          }}
        >
          {project.title}
        </h3>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            fontWeight: 300,
            color: "rgba(240,240,240,0.55)",
            lineHeight: 1.7,
            flex: 1,
          }}
        >
          {project.description}
        </p>

        {/* Stack tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
          {project.stack.map((tech) => (
            <span
              key={tech}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.6875rem",
                fontWeight: 400,
                color: "rgba(240,240,240,0.35)",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "0.2rem 0.5rem",
                letterSpacing: "0.03em",
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        {(project.demo || project.repo) && (
          <div
            style={{
              display: "flex",
              gap: "1.25rem",
              marginTop: "0.25rem",
              paddingTop: "0.75rem",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  color: "rgba(240,240,240,0.6)",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.15)",
                  paddingBottom: "1px",
                  transition: "color 0.2s, border-color 0.2s",
                }}
              >
                Demo →
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8125rem",
                  color: "rgba(240,240,240,0.6)",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.15)",
                  paddingBottom: "1px",
                  transition: "color 0.2s, border-color 0.2s",
                }}
              >
                Repo →
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
}

export default function Projects() {
  return (
    <section id="projects" style={SECTION_STYLE}>
      <SectionTitle number="04" title="Projects" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 480px), 1fr))",
          gap: "1.5rem",
        }}
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
