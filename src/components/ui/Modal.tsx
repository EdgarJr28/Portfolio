"use client";

import { motion, AnimatePresence } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Estilos del contenedor interno (la "caja" del modal). Por defecto: caja centrada con padding. */
  contentStyle?: CSSProperties;
  showCloseButton?: boolean;
}

const DEFAULT_CONTENT_STYLE: CSSProperties = {
  position: "relative",
  background: "#0f0f0f",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "8px",
  padding: "3rem 2.5rem",
  maxWidth: "440px",
  width: "100%",
  textAlign: "center",
};

/** Modal genérico reutilizable: fondo difuminado, cierra al hacer click afuera o en la X. */
export default function Modal({
  open,
  onClose,
  children,
  contentStyle,
  showCloseButton = true,
}: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(3,3,6,0.97)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{ ...DEFAULT_CONTENT_STYLE, ...contentStyle }}
          >
            {showCloseButton && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                aria-label="Cerrar"
                style={{
                  position: "absolute",
                  top: "0.75rem",
                  right: "0.75rem",
                  zIndex: 10,
                  background: "rgba(0,0,0,0.5)",
                  border: "none",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  color: "#f0f0f0",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
