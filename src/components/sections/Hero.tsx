"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import NameEasterEggModal from "./NameEasterEggModal";
import { useIsMobile } from "@/components/three/useIsMobile";
import { useLang } from "@/context/LangContext";
import { t, tr } from "@/lib/i18n";

const IntroCanvas = dynamic(() => import("./HeroIntroCanvas"), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const [nameEggOpen, setNameEggOpen] = useState(false);
  const isMobile = useIsMobile();
  const { lang } = useLang();
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
      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", width: "100%", minHeight: "100vh" }}>
          <div style={{ position: "relative", height: "65vh", flexShrink: 0 }}>
            <IntroCanvas />
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
            <TextContent scrollTo={scrollTo} onNameClick={() => setNameEggOpen(true)} lang={lang} centered />
          </div>
        </div>
      ) : (
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
            <TextContent scrollTo={scrollTo} onNameClick={() => setNameEggOpen(true)} lang={lang} />
          </div>
          <div
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
      )}

      {/* fade removed */}

      <NameEasterEggModal open={nameEggOpen} onClose={() => setNameEggOpen(false)} />
    </section>
  );
}

function TextContent({
  scrollTo,
  onNameClick,
  lang,
  centered = false,
}: {
  scrollTo: (id: string) => void;
  onNameClick?: () => void;
  lang: "es" | "en";
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
        {tr(t.hero.tag, lang)}
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
        <Button onClick={() => scrollTo("projects")}>{tr(t.hero.cta_work, lang)}</Button>
        <Button onClick={() => scrollTo("contact")}>{tr(t.hero.cta_contact, lang)}</Button>
      </motion.div>

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
            {tr(t.hero.scroll, lang)}
          </span>
        </motion.div>
      )}
    </div>
  );
}
