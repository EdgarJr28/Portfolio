"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import Modal from "@/components/ui/Modal";

interface PlaylistItem {
  id: string;
  name: string;
  description: string;
  image: string;
  url: string;
  trackCount: number;
}

interface PlaylistData {
  ownerName: string;
  playlists: PlaylistItem[];
}

const AUTOPLAY_MS = 4000;

export default function SpotifyPlaylistModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [data, setData] = useState<PlaylistData | null | undefined>(undefined);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const dragXRef = useRef(0);
  const justDraggedRef = useRef(false);

  const goTo = (next: number, dir: number) => {
    setDirection(dir);
    setIndex(next);
  };

  // El backdrop del modal cierra al hacer click afuera; un drag largo del
  // carrusel puede terminar con el mouse fuera de la tarjeta y disparar ese
  // click por accidente. Esta guarda lo ignora justo después de arrastrar.
  const handleClose = () => {
    if (justDraggedRef.current) return;
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    setData(undefined);
    setIndex(0);
    fetch("/api/playlist")
      .then((res) => (res.ok ? res.json() : null))
      .then(setData)
      .catch(() => setData(null));
  }, [open]);

  // Autoplay del carrusel
  useEffect(() => {
    if (!data?.playlists?.length) return;
    const id = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % data.playlists.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [data?.playlists?.length]);

  const playlist = data?.playlists?.[index];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      contentStyle={{
        background: "#0f0f0f",
        maxWidth: "420px",
        padding: "2rem 1.75rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
        <FontAwesomeIcon icon={faSpotify} color="#1DB954" width={16} />
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.75rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(240,240,240,0.5)",
          }}
        >
          My Playlists on Spotify
        </span>
      </div>

      {data?.ownerName && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.8125rem",
            color: "#1DB954",
            marginBottom: "1.5rem",
          }}
        >
          {data.ownerName}
        </p>
      )}

      {data === undefined && (
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "rgba(240,240,240,0.4)", padding: "2rem 0" }}>
          Cargando…
        </p>
      )}

      {data === null && (
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "rgba(240,240,240,0.4)", padding: "2rem 0" }}>
          No se pudieron cargar las playlists.
        </p>
      )}

      {playlist && (
        <>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={playlist.id}
              custom={direction}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onPointerDown={() => {
                dragXRef.current = 0;
              }}
              onDragStart={() => {
                justDraggedRef.current = true;
              }}
              onDrag={(_, info) => {
                dragXRef.current = info.offset.x;
              }}
              onDragEnd={(_, info) => {
                const count = data?.playlists.length ?? 1;
                const threshold = 60;
                if (info.offset.x < -threshold) {
                  goTo((index + 1) % count, 1);
                } else if (info.offset.x > threshold) {
                  goTo((index - 1 + count) % count, -1);
                }
                // Deja pasar el click fantasma del mouseup y recién ahí reactiva el cierre
                setTimeout(() => {
                  justDraggedRef.current = false;
                }, 100);
              }}
              variants={{
                enter: (dir: number) => ({ opacity: 0, x: dir * 60 }),
                center: { opacity: 1, x: 0 },
                exit: (dir: number) => ({ opacity: 0, x: -dir * 60 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                cursor: "grab",
                touchAction: "pan-y",
                WebkitUserDrag: "none",
                userSelect: "none",
              } as React.CSSProperties}
              whileTap={{ cursor: "grabbing" }}
            >
              <a
                href={playlist.url}
                target="_blank"
                rel="noopener noreferrer"
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                onClick={(e) => {
                  if (Math.abs(dragXRef.current) > 8) e.preventDefault();
                }}
                style={{
                  display: "block",
                  textDecoration: "none",
                  perspective: "1100px",
                  WebkitUserDrag: "none",
                  userSelect: "none",
                } as React.CSSProperties}
              >
                <motion.div
                  whileHover={{
                    scale: 1.04,
                    rotateY: 10,
                    rotateX: 6,
                  }}
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1 / 1",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                  }}
                >
                  <Image
                    src={playlist.image}
                    alt={playlist.name}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="380px"
                    unoptimized
                    draggable={false}
                  />
                </motion.div>

                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: "#f0f0f0",
                    textAlign: "center",
                    marginTop: "1rem",
                  }}
                >
                  {playlist.name}
                </p>
                {playlist.description && (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      color: "rgba(240,240,240,0.4)",
                      textAlign: "center",
                      marginTop: "0.25rem",
                    }}
                  >
                    {playlist.description}
                  </p>
                )}
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.6875rem",
                    color: "rgba(240,240,240,0.3)",
                    textAlign: "center",
                    marginTop: "0.2rem",
                  }}
                >
                  {playlist.trackCount} tracks
                </p>
              </a>
            </motion.div>
          </AnimatePresence>

          {/* Indicadores / navegación manual */}
          <div style={{ display: "flex", justifyContent: "center", gap: "0.4rem", marginTop: "1.25rem" }}>
            {data?.playlists.map((p, i) => (
              <button
                key={p.id}
                onClick={() => goTo(i, i > index ? 1 : -1)}
                aria-label={`Ver playlist ${p.name}`}
                style={{
                  width: i === index ? "18px" : "6px",
                  height: "6px",
                  borderRadius: "3px",
                  border: "none",
                  background: i === index ? "#1DB954" : "rgba(255,255,255,0.2)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </>
      )}
    </Modal>
  );
}
