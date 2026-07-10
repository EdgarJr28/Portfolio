"use client";

import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "ghost" | "solid";
  style?: CSSProperties;
}

const VARIANT_STYLE: Record<NonNullable<ButtonProps["variant"]>, CSSProperties> = {
  ghost: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "#f0f0f0",
  },
  solid: {
    background: "#f0f0f0",
    border: "1px solid #f0f0f0",
    color: "#0a0a0a",
  },
};

/** Botón reutilizable del sitio (bordes finos, tipografía uniforme). */
export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "ghost",
  style,
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { borderColor: "rgba(255,255,255,0.65)" }}
      style={{
        padding: "0.7rem 1.6rem",
        fontFamily: "var(--font-body)",
        fontSize: "0.875rem",
        fontWeight: 400,
        letterSpacing: "0.04em",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "opacity 0.2s, border-color 0.2s",
        ...VARIANT_STYLE[variant],
        ...style,
      }}
    >
      {children}
    </motion.button>
  );
}
