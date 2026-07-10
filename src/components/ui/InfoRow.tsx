import type { CSSProperties } from "react";

interface InfoRowProps {
  label: string;
  value: string;
  /** Sombra de texto — útil cuando la fila va encima de una escena 3D/imagen. */
  withShadow?: boolean;
}

/** Fila "Etiqueta — valor" usada en About y secciones similares. */
export default function InfoRow({ label, value, withShadow = false }: InfoRowProps) {
  const shadow: CSSProperties = withShadow
    ? { textShadow: "0 2px 8px rgba(0,0,0,0.6)" }
    : {};

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        alignItems: "baseline",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        paddingBottom: "0.6rem",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.75rem",
          letterSpacing: "0.12em",
          color: "rgba(240,240,240,0.5)",
          textTransform: "uppercase",
          width: "100px",
          flexShrink: 0,
          ...shadow,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.9rem",
          fontWeight: 300,
          color: "rgba(240,240,240,0.9)",
          ...shadow,
        }}
      >
        {value}
      </span>
    </div>
  );
}
