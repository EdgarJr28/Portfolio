"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import SectionTitle from "@/components/ui/SectionTitle";
import Modal from "@/components/ui/Modal";
import InfoRow from "@/components/ui/InfoRow";
import Blessed from "../../../public/svg/blessed";
import { useIsMobile } from "@/components/three/useIsMobile";
import { useLang } from "@/context/LangContext";
import { t, tr } from "@/lib/i18n";

const AboutDeskCanvas = dynamic(() => import("./AboutDeskCanvas"), { ssr: false, loading: () => null });
const SnowOverlay = dynamic(() => import("@/components/three/scenes/SnowOverlay"), { ssr: false, loading: () => null });
const MiniOS = dynamic(() => import("./MiniOS"), { ssr: false, loading: () => null });

const EASTER_EGG_VIDEO = encodeURI("/easter/iceman/ICEMAN VIDEO EASTEREGG.mp4");
const EASTER_EGG_IMAGE = "/easter/iceman/Ed.png";

export default function About() {
  const [easterEggOpen, setEasterEggOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [miniOsOpen, setMiniOsOpen] = useState(false);
  const [miniOsMounted, setMiniOsMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const isMobile = useIsMobile();
  const { lang } = useLang();

  const openMiniOS = () => {
    setMiniOsMounted(true);
    setMiniOsOpen(true);
  };

  const closeMiniOS = () => {
    setMiniOsOpen(false);
    setTimeout(() => setMiniOsMounted(false), 350);
  };

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("debugOS")) openMiniOS();
  }, []);

  useEffect(() => {
    const show = () => {
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000);
    };
    show();
    const id = setInterval(show, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="about"
      className="flex flex-col min-h-[68vh] md:flex-row md:items-center md:min-h-screen"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <div className="relative w-full h-[38vh] shrink-0 md:absolute md:inset-0 md:h-auto md:z-0">
        <AboutDeskCanvas
          onFrameClick={() => setEasterEggOpen(true)}
          onNoteClick={() => setNoteOpen(true)}
          onScreenClick={() => openMiniOS()}
        />
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              key="touch-tooltip"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: isMobile ? "18%" : "22%",
                left: isMobile ? "52%" : "56%",
                pointerEvents: "none",
                zIndex: 10,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
                <path d="M0 5L7 0v10L0 5z" fill="rgba(255,255,255,0.5)" />
              </svg>
              <span
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(240,240,240,0.9)",
                  background: "rgba(0,0,0,0.55)",
                  backdropFilter: "blur(6px)",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  whiteSpace: "nowrap",
                }}
              >
                touch me
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        aria-hidden="true"
        className="hidden md:block"
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.15) 35%, rgba(10,10,10,0.15) 65%, rgba(10,10,10,0.85) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      <div
        className="relative z-[2] w-full pt-8 pb-12 md:pt-24 md:pb-16 md:pointer-events-none"
        style={isMobile ? {
          paddingLeft: "clamp(1.5rem, 5vw, 4rem)",
          paddingRight: "clamp(1.25rem, 5vw, 4rem)",
        } : {
          paddingLeft: "clamp(12rem, 5vw, 4rem)",
          paddingRight: "clamp(1.25rem, 5vw, 4rem)",
        }}
      >
        <SectionTitle number="01" title="About" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ maxWidth: "560px" }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1rem, 2vw, 1.125rem)",
              fontWeight: 300,
              color: "rgba(240,240,240,0.85)",
              lineHeight: 1.9,
              marginBottom: "2rem",
              textShadow: "0 2px 12px rgba(0,0,0,0.6)",
            }}
          >
            {tr(t.about.bio, lang)}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <InfoRow withShadow label={tr(t.about.location_label, lang)} value={tr(t.about.location_value, lang)} />
            <InfoRow withShadow label={tr(t.about.email_label, lang)} value="ed.dev28@gmail.com" />
            <InfoRow withShadow label={tr(t.about.exp_label, lang)} value={tr(t.about.exp_value, lang)} />
            <InfoRow withShadow label={tr(t.about.avail_label, lang)} value={tr(t.about.avail_value, lang)} />
          </div>
        </motion.div>
      </div>

      <EasterEggModal open={easterEggOpen} onClose={() => setEasterEggOpen(false)} />
      <NoteModal open={noteOpen} onClose={() => setNoteOpen(false)} />
      {miniOsMounted && <MiniOS open={miniOsOpen} onClose={closeMiniOS} />}
    </section>
  );
}

function NoteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} contentStyle={{ background: "#0a0a0a", maxWidth: "640px", width: "auto", padding: "2.5rem" }}>
      <p style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "clamp(0.95rem, 3vw, 1.15rem)", color: "#f0f0f0", lineHeight: 1.6, margin: "1rem 0 1.5rem", textAlign: "center" }}>
        &quot;all that hard work gonna pay off&quot;
      </p>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Blessed color="#f0f0f0" className="w-40 h-40" />
      </div>
    </Modal>
  );
}

function EasterEggModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [percent, setPercent] = useState(0);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (!open) {
      setLoaded(false); setPercent(0); setEnded(false);
      videoRef.current?.pause();
      return;
    }
    const video = videoRef.current;
    if (!video) return;

    const checkBuffered = () => {
      if (video.buffered.length && video.duration) {
        const pct = Math.min(100, Math.round((video.buffered.end(video.buffered.length - 1) / video.duration) * 100));
        setPercent(pct);
        if (pct >= 99) { setLoaded(true); video.play().catch(() => {}); }
      }
    };
    const handleCanPlayThrough = () => { setPercent(100); setLoaded(true); video.play().catch(() => {}); };
    const handleEnded = () => setEnded(true);

    video.addEventListener("progress", checkBuffered);
    video.addEventListener("loadedmetadata", checkBuffered);
    video.addEventListener("canplaythrough", handleCanPlayThrough);
    video.addEventListener("ended", handleEnded);
    video.load();
    return () => {
      video.removeEventListener("progress", checkBuffered);
      video.removeEventListener("loadedmetadata", checkBuffered);
      video.removeEventListener("canplaythrough", handleCanPlayThrough);
      video.removeEventListener("ended", handleEnded);
    };
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} contentStyle={{ display: "inline-block", width: "auto", lineHeight: 0, background: "#000", padding: "6px", maxWidth: "90vw", maxHeight: "85vh", textAlign: "left" }}>
      <video ref={videoRef} src={EASTER_EGG_VIDEO} preload="auto" playsInline style={{ display: "block", maxWidth: "calc(90vw - 12px)", maxHeight: "calc(85vh - 12px)" }} />
      <AnimatePresence>
        {ended && (
          <motion.img src={EASTER_EGG_IMAGE} alt="Ed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0, zIndex: 1, width: "100%", height: "100%", objectFit: "contain", background: "#000" }}
          />
        )}
      </AnimatePresence>
      <SnowOverlay />
      <AnimatePresence>
        {!loaded && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ position: "absolute", inset: 0, zIndex: 2, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}
          >
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(240,240,240,0.6)" }}>
              Cargando… {percent}%
            </span>
            <div style={{ width: "160px", height: "2px", background: "rgba(255,255,255,0.15)" }}>
              <div style={{ width: `${percent}%`, height: "100%", background: "#f0f0f0", transition: "width 0.2s ease-out" }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
