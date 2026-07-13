"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { WIN_FONT } from "./shared";
import { useScrollMemory } from "./useScrollMemory";

/**
 * Carpeta "Fotos" del escritorio: junta todas mis fotos personales que ya
 * se usan en la sección Blog (marcos del bosque 3D + la luna/corazón),
 * vía /api/photos. Agregar una foto nueva a esas carpetas reales la suma
 * acá también, sin tocar código. Doble click en una foto la abre en el
 * visor de imágenes del mini-OS (ver ImageViewer.tsx).
 */
interface Photo {
  src: string;
  date: string;
}

export default function PhotosFolder({
  onOpenImage,
}: {
  onOpenImage: (src: string, date: string) => void;
}) {
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const { ref: scrollRef, onScroll } = useScrollMemory<HTMLDivElement>("photos", [photos]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/photos")
      .then((res) => res.json())
      .then((data: { photos?: Photo[] }) => {
        if (!cancelled) setPhotos(data.photos ?? []);
      })
      .catch(() => {
        if (!cancelled) setPhotos([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ height: "100%", background: "#fff", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          padding: "0.5rem 0.7rem",
          borderBottom: "1px solid #9a9584",
          fontFamily: WIN_FONT,
          fontSize: "0.72rem",
          color: "#000",
          fontWeight: 700,
        }}
      >
        Fotos ({photos?.length ?? "..."})
      </div>
      <div
        ref={scrollRef}
        onScroll={onScroll}
        data-mos-scroll
        style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "0.8rem" }}
        onClick={(e) => {
          // Click en el fondo vacío (no en una foto) deselecciona.
          if (e.target === e.currentTarget) setSelected(null);
        }}
      >
        {photos === null ? (
          <p style={{ fontFamily: WIN_FONT, fontSize: "0.75rem", color: "#555" }}>Cargando...</p>
        ) : photos.length === 0 ? (
          <p style={{ fontFamily: WIN_FONT, fontSize: "0.75rem", color: "#555" }}>
            Todavía no hay fotos acá.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
              gap: "0.6rem",
            }}
          >
            {photos.map(({ src, date }) => {
              const isSelected = selected === src;
              return (
                <button
                  key={src}
                  onClick={() => setSelected(src)}
                  onDoubleClick={() => onOpenImage(src, date)}
                  style={{
                    position: "relative",
                    display: "block",
                    padding: "3px",
                    border: isSelected ? "1px solid #0a3aa8" : "1px solid #ccc",
                    borderRadius: "3px",
                    overflow: "hidden",
                    background: isSelected ? "#cbe3ff" : "#eee",
                    boxShadow: isSelected ? "0 0 0 2px rgba(11,97,255,0.35)" : "none",
                    aspectRatio: "1 / 1",
                    cursor: "pointer",
                  }}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="110px"
                    draggable={false}
                    style={{
                      objectFit: "cover",
                      opacity: isSelected ? 0.85 : 1,
                    }}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
