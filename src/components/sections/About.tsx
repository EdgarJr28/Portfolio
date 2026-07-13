"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import SectionTitle from "@/components/ui/SectionTitle";
import Modal from "@/components/ui/Modal";
import InfoRow from "@/components/ui/InfoRow";
import Blessed from "../../../public/svg/blessed";

// Escena 3D del escritorio (room + avatar escribiendo) — carga diferida
const AboutDeskCanvas = dynamic(() => import("./AboutDeskCanvas"), {
  ssr: false,
  loading: () => null,
});

// Nieve 3D del easter egg — carga diferida (WebGL, solo cliente)
const SnowOverlay = dynamic(() => import("@/components/three/scenes/SnowOverlay"), {
  ssr: false,
  loading: () => null,
});

// Mini "sistema operativo" de la pantalla del escritorio — carga diferida
const MiniOS = dynamic(() => import("./MiniOS"), {
  ssr: false,
  loading: () => null,
});

const EASTER_EGG_VIDEO = encodeURI("/easter/iceman/ICEMAN VIDEO EASTEREGG.mp4");
const EASTER_EGG_IMAGE = "/easter/iceman/Ed.png";

export default function About() {
  const [easterEggOpen, setEasterEggOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [miniOsOpen, setMiniOsOpen] = useState(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("debugOS")) setMiniOsOpen(true);
  }, []);

  return (
    <section
      id="about"
      className="flex flex-col min-h-[68vh] md:flex-row md:items-center md:min-h-screen"
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* En mobile: la animación va arriba, compacta y en flujo normal
          (single-column: animación → texto, sin superponerse). En desktop
          (md+) vuelve al modo "cinemático" de siempre: canvas de fondo a
          pantalla completa con el texto flotando encima. */}
      <div className="relative w-full h-[38vh] shrink-0 md:absolute md:inset-0 md:h-auto md:z-0">
        <AboutDeskCanvas
          onFrameClick={() => setEasterEggOpen(true)}
          onNoteClick={() => setNoteOpen(true)}
          onScreenClick={() => setMiniOsOpen(true)}
        />
      </div>

      {/* Degradado para legibilidad del texto encima del modelo — solo
          aplica en el modo overlay de desktop, en mobile el texto ya no
          se superpone al canvas. */}
      <div
        aria-hidden="true"
        className="hidden md:block"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.15) 35%, rgba(10,10,10,0.15) 65%, rgba(10,10,10,0.85) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Texto: en mobile, bloque normal debajo de la animación. En desktop,
          superpuesto (pointerEvents:none para no tapar los clics del canvas,
          ej. la placa Iceman). */}
      <div
        className="relative z-[2] w-full pt-8 pb-12 md:pt-24 md:pb-16 md:pointer-events-none"
        style={{
          paddingLeft: "clamp(1.25rem, 5vw, 4rem)",
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
            Frontend developer con pasión por construir interfaces rápidas,
            accesibles y visualmente memorables. Especializado en React y
            Next.js, con foco en rendimiento y experiencia de usuario.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <InfoRow withShadow label="Ubicación" value="Barranquilla, Colombia" />
            <InfoRow withShadow label="Email" value="ed.dev28@gmail.com" />
            <InfoRow withShadow label="Experiencia" value="5+ años" />
            <InfoRow withShadow label="Disponibilidad" value="Abierto a oportunidades" />
          </div>
        </motion.div>
      </div>

      <EasterEggModal open={easterEggOpen} onClose={() => setEasterEggOpen(false)} />
      <NoteModal open={noteOpen} onClose={() => setNoteOpen(false)} />
      <MiniOS open={miniOsOpen} onClose={() => setMiniOsOpen(false)} />
    </section>
  );
}

function NoteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      contentStyle={{
        background: "#0a0a0a",
        maxWidth: "640px",
        width: "auto",
        padding: "2.5rem 2.5rem",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "clamp(0.95rem, 3vw, 1.15rem)",
          color: "#f0f0f0",
          lineHeight: 1.6,
          margin: "1rem 0 1.5rem",
          textAlign: "center",
        }}
      >
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
      // reset para la próxima vez que se abra
      setLoaded(false);
      setPercent(0);
      setEnded(false);
      videoRef.current?.pause();
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    const checkBuffered = () => {
      if (video.buffered.length && video.duration) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const pct = Math.min(100, Math.round((bufferedEnd / video.duration) * 100));
        setPercent(pct);
        if (pct >= 99) {
          setLoaded(true);
          video.play().catch(() => {});
        }
      }
    };

    const handleCanPlayThrough = () => {
      setPercent(100);
      setLoaded(true);
      video.play().catch(() => {});
    };
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
    <Modal
      open={open}
      onClose={onClose}
      contentStyle={{
        display: "inline-block",
        width: "auto",
        lineHeight: 0,
        background: "#000",
        padding: "6px",
        maxWidth: "90vw",
        maxHeight: "85vh",
        textAlign: "left",
      }}
    >
      {/* Video: define el tamaño natural del modal (con tope de viewport) */}
      <video
        ref={videoRef}
        src={EASTER_EGG_VIDEO}
        preload="auto"
        playsInline
        style={{
          display: "block",
          maxWidth: "calc(90vw - 12px)",
          maxHeight: "calc(85vh - 12px)",
        }}
      />

      {/* Al terminar el video, fade a la imagen final en el mismo modal */}
      <AnimatePresence>
        {ended && (
          <motion.img
            src={EASTER_EGG_IMAGE}
            alt="Ed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              background: "#000",
            }}
          />
        )}
      </AnimatePresence>

      {/* Nieve por encima de todo (video/imagen + fade) */}
      <SnowOverlay />

      {/* Fade de carga: tapa el video hasta que termine de bufferear */}
      <AnimatePresence>
        {!loaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              background: "#000",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(240,240,240,0.6)",
              }}
            >
              Cargando… {percent}%
            </span>
            <div
              style={{
                width: "160px",
                height: "2px",
                background: "rgba(255,255,255,0.15)",
              }}
            >
              <div
                style={{
                  width: `${percent}%`,
                  height: "100%",
                  background: "#f0f0f0",
                  transition: "width 0.2s ease-out",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
