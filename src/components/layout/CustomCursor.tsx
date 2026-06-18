"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  const x = useSpring(rawX, { damping: 28, stiffness: 350 });
  const y = useSpring(rawY, { damping: 28, stiffness: 350 });

  useEffect(() => {
    // Detectar dispositivo touch — no mostrar cursor personalizado
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX - 6);
      rawY.set(e.clientY - 6);
      if (!visible) setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest(
        "a, button, [data-cursor-hover]"
      );
      if (el) setHovered(true);
    };

    const onOut = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest(
        "a, button, [data-cursor-hover]"
      );
      if (el) setHovered(false);
    };

    const onLeave = () => setVisible(false);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [rawX, rawY, visible]);

  if (isTouch || !visible) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        x,
        y,
        width: hovered ? "24px" : "12px",
        height: hovered ? "24px" : "12px",
        marginLeft: hovered ? "-6px" : "0px",
        marginTop: hovered ? "-6px" : "0px",
        borderRadius: "50%",
        backgroundColor: "rgba(240,240,240,0.85)",
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "difference",
        transition: "width 0.15s ease, height 0.15s ease, margin 0.15s ease",
      }}
    />
  );
}
