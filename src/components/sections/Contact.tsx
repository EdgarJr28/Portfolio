"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faSquareXTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import SectionTitle from "@/components/ui/SectionTitle";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

// Isla flotante 3D — decorativa, carga diferida
const ContactIslandCanvas = dynamic(() => import("./ContactIslandCanvas"), {
  ssr: false,
  loading: () => null,
});

type FormStatus = "idle" | "loading" | "success" | "error";

const SECTION_STYLE = {
  padding: "160px clamp(1.25rem, 5vw, 3rem)",
  maxWidth: "1200px",
  margin: "0 auto",
};

const SOCIALS = [
  {
    icon: faGithub,
    href: "https://github.com/EdgarJr28",
    label: "GitHub",
  },
  {
    icon: faLinkedin,
    href: "https://linkedin.com/in/edgar-maldonado-5619171a0",
    label: "LinkedIn",
  },
  {
    icon: faSquareXTwitter,
    href: "https://x.com/ed__28",
    label: "X",
  },
  {
    icon: faInstagram,
    href: "https://instagram.com/ed__2898",
    label: "Instagram",
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" style={SECTION_STYLE}>
      <SectionTitle number="07" title="Contact" />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
          gap: "clamp(3rem, 8vw, 6rem)",
          alignItems: "start",
        }}
      >
        {/* ── Columna izquierda: info ── */}
        <div>
          <a
            href="mailto:ed.dev28@gmail.com"
            style={{
              display: "block",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.1rem, 2.5vw, 1.75rem)",
              fontWeight: 700,
              color: "#f0f0f0",
              textDecoration: "none",
              letterSpacing: "-0.02em",
              borderBottom: "1px solid rgba(255,255,255,0.12)",
              paddingBottom: "0.4rem",
              marginBottom: "2.5rem",
              wordBreak: "break-all",
              transition: "color 0.2s",
            }}
          >
            ed.dev28@gmail.com
          </a>

          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            {SOCIALS.map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                style={{
                  color: "rgba(240,240,240,0.4)",
                  transition: "color 0.2s",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon icon={icon} width={22} height={22} />
              </a>
            ))}
          </div>

          {/* Isla flotante 3D — solo desktop */}
          <div
            className="hidden md:block"
            style={{ position: "relative", height: "280px", marginTop: "2rem" }}
          >
            <ContactIslandCanvas />
          </div>
        </div>

        {/* ── Columna derecha: formulario ── */}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
        >
          <TextField
            type="text"
            name="name"
            placeholder="Nombre"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <TextField
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <TextField
            as="textarea"
            name="message"
            placeholder="Mensaje"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            <Button
              type="submit"
              disabled={status === "loading"}
              style={{ padding: "0.75rem 2rem" }}
            >
              {status === "loading" ? "Enviando…" : "Enviar mensaje"}
            </Button>

            <AnimatePresence mode="wait">
              {status === "success" && (
                <motion.p
                  key="success"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    color: "rgba(50,213,131,0.85)",
                  }}
                >
                  ✓ Mensaje enviado
                </motion.p>
              )}
              {status === "error" && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    color: "rgba(255,70,74,0.85)",
                  }}
                >
                  Error al enviar. Inténtalo de nuevo.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>
    </section>
  );
}
