"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "motion/react";
import Modal from "@/components/ui/Modal";
import Typewriter from "@/components/ui/Typewriter";

const FallingAvatarCanvas = dynamic(() => import("./FallingAvatarCanvas"), {
  ssr: false,
  loading: () => null,
});

const PHRASES = [
  "Developing ideas, a moment...",
  "Hello, it's wonderful to see you!",
  "Wishing you a day full of positivity and joy!",
  "Turn ideas into reality. Happy coding!",
  "Hey! Nice to meet you.",
];

const SONG_URL = "/easter/about_me/Gunna.mp3";

export default function NameEasterEggModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (open) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      contentStyle={{
        background:
          "radial-gradient(ellipse at 25% 50%, rgba(30,30,70,0.55), #0a0a0f 70%)",
        maxWidth: "740px",
        width: "100%",
        height: "min(440px, 75vh)",
        padding: 0,
        textAlign: "left",
        overflow: "hidden",
      }}
    >
      <audio ref={audioRef} src={SONG_URL} loop preload="auto" />

      {/* Animación a todo el ancho/alto del modal, tirada a la izquierda, con estrellas */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <FallingAvatarCanvas />
      </div>

      {/* Degradado para separar el texto de la animación */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, transparent 40%, rgba(10,10,15,0.55) 62%, rgba(10,10,15,0.92) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Foto + texto — a la derecha, sin pisar la animación */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "1.75rem",
        }}
      >
        <div style={{ width: "230px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
            <motion.div
              data-cursor-hover
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.6, zIndex: 5 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                position: "relative",
                width: "88px",
                height: "88px",
                borderRadius: "12px",
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              <Image
                src="/images/me.JPEG"
                alt="Edgar"
                fill
                style={{ objectFit: "cover" }}
                sizes="160px"
              />
            </motion.div>
          </div>

          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "#f0f0f0",
              textAlign: "center",
              marginBottom: "0.6rem",
            }}
          >
            Edgar
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              fontWeight: 300,
              color: "rgba(240,240,240,0.75)",
              lineHeight: 1.6,
              textAlign: "center",
              marginBottom: "1.1rem",
              textShadow: "0 2px 10px rgba(0,0,0,0.6)",
            }}
          >
            Hello a pleasure, I am a cheerful and vibrant person, I really
            like music and art, I emphasize that I like quiet places and I
            have happiness as an engine of personal growth.
          </p>

          <div
            style={{
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              padding: "0.75rem 0.9rem",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                color: "#4ade80",
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "0.75rem",
                flexShrink: 0,
              }}
            >
              &gt;
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Typewriter
                phrases={PHRASES}
                typingSpeed={80}
                pauseTime={2200}
                style={{
                  color: "#4ade80",
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.75rem",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
