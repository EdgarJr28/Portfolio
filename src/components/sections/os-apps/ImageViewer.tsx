"use client";

import Image from "next/image";
import { WIN_FONT } from "./shared";

function formatPhotoDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Visor de imágenes simple: abre una foto de la carpeta "Fotos" en su propia ventana del SO. */
export default function ImageViewer({ src, date }: { src: string | null; date?: string | null }) {
  if (!src) {
    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1e1e1e",
        }}
      >
        <p style={{ fontFamily: WIN_FONT, fontSize: "0.75rem", color: "#aaa" }}>
          No hay ninguna imagen para mostrar.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#1e1e1e",
        overflow: "auto",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 640px"
          style={{ objectFit: "contain" }}
        />
      </div>
      {date && (
        <span
          style={{
            position: "absolute",
            bottom: "0.5rem",
            right: "0.6rem",
            fontFamily: WIN_FONT,
            fontSize: "0.68rem",
            color: "#ffd400",
            textShadow: "0 1px 2px rgba(0,0,0,0.85)",
            pointerEvents: "none",
          }}
        >
          {formatPhotoDate(date)}
        </span>
      )}
    </div>
  );
}
