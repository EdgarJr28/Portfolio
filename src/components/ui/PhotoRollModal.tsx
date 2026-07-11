"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import Modal from "./Modal";

interface PhotoRollModalProps {
  open: boolean;
  onClose: () => void;
  photos: string[];
  title?: string;
}

// Inclinaciones fijas para las fotos que asoman detrás, efecto "mesa"
const PEEK_ROTATIONS = [-5, 4];

/**
 * Modal tipo "fotos sobre la mesa": una pila de fotos superpuestas y
 * ligeramente inclinadas; se toca la de arriba para pasarla y ver la
 * siguiente, siempre completa (sin recortar, con object-fit contain).
 */
export default function PhotoRollModal({
  open,
  onClose,
  photos,
  title,
}: PhotoRollModalProps) {
  const [index, setIndex] = useState(0);

  // Reinicia la pila al reabrir el modal (ajuste de estado durante el
  // render, sin efecto, siguiendo el patrón recomendado por React para
  // "resetear estado cuando cambia una prop").
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setIndex(0);
  }

  const next = () => setIndex((i) => (i + 1) % photos.length);

  return (
    <Modal
      open={open}
      onClose={onClose}
      contentStyle={{
        width: "min(400px, 92vw)",
        maxWidth: "400px",
        padding: "1.5rem",
        background: "#141210",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "12px",
        textAlign: "center",
      }}
    >
      {title && (
        <div
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
            marginBottom: "1.1rem",
          }}
        >
          {title}
        </div>
      )}

      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "3 / 4",
          margin: "0 auto",
        }}
      >
        {/* Fotos siguientes, asomando detrás como si estuvieran sobre la mesa */}
        {photos.length > 1 &&
          [1, 2].map((offset) => {
            if (offset >= photos.length) return null;
            const i = (index + offset) % photos.length;
            return (
              <div
                key={`peek-${offset}`}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "6px",
                  overflow: "hidden",
                  background: "#000",
                  transform: `rotate(${PEEK_ROTATIONS[offset - 1]}deg) scale(${1 - offset * 0.035})`,
                  boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
                  zIndex: 10 - offset,
                }}
              >
                <Image
                  src={photos[i]}
                  alt=""
                  fill
                  sizes="400px"
                  style={{ objectFit: "contain" }}
                />
              </div>
            );
          })}

        {/* Foto activa: tocarla la manda al fondo de la pila y muestra la siguiente */}
        <AnimatePresence initial={false} mode="popLayout">
          <motion.button
            key={index}
            onClick={next}
            initial={{ x: 40, opacity: 0, rotate: 3 }}
            animate={{ x: 0, opacity: 1, rotate: 0 }}
            exit={{ x: -260, opacity: 0, rotate: -14 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            aria-label="Ver siguiente foto"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 20,
              border: "none",
              padding: 0,
              cursor: photos.length > 1 ? "pointer" : "default",
              borderRadius: "6px",
              overflow: "hidden",
              background: "#000",
              boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
            }}
          >
            <Image
              src={photos[index]}
              alt=""
              fill
              sizes="400px"
              style={{ objectFit: "contain" }}
            />
          </motion.button>
        </AnimatePresence>
      </div>

      {photos.length > 1 && (
        <>
          <div
            style={{
              marginTop: "1.1rem",
              display: "flex",
              justifyContent: "center",
              gap: "0.4rem",
            }}
          >
            {photos.map((_, i) => (
              <span
                key={i}
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: i === index ? "#f0f0f0" : "rgba(255,255,255,0.25)",
                }}
              />
            ))}
          </div>
          <div
            style={{
              marginTop: "0.5rem",
              fontSize: "0.75rem",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            Toca la foto para pasar a la siguiente
          </div>
        </>
      )}
    </Modal>
  );
}
