"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { FastAverageColor } from "fast-average-color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import SectionTitle from "@/components/ui/SectionTitle";

interface NowPlayingData {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumImage: string;
  songUrl?: string;
}

const SECTION_STYLE = {
  padding: "160px clamp(1.25rem, 5vw, 3rem)",
  maxWidth: "1200px",
  margin: "0 auto",
};

function SkeletonCard() {
  return (
    <div
      style={{
        width: "280px",
        height: "360px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "2px",
        animation: "pulse 2s ease-in-out infinite",
      }}
    />
  );
}

function NotPlaying() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        color: "rgba(240,240,240,0.35)",
        fontFamily: "var(--font-body)",
        fontSize: "0.875rem",
      }}
    >
      <FontAwesomeIcon icon={faSpotify} color="#1DB954" width={20} />
      Not playing right now
    </div>
  );
}

export default function SpotifyWidget() {
  const [track, setTrack] = useState<NowPlayingData | null | undefined>(
    undefined // undefined = loading, null = no track
  );
  const [glowColor, setGlowColor] = useState("rgba(0,0,0,0)");
  const facRef = useRef<FastAverageColor | null>(null);

  const fetchTrack = async () => {
    try {
      const res = await fetch("/api/spotify");
      const data: NowPlayingData | null = res.ok ? await res.json() : null;
      setTrack(data);
    } catch {
      setTrack(null);
    }
  };

  useEffect(() => {
    facRef.current = new FastAverageColor();
    fetchTrack();
    const id = setInterval(fetchTrack, 30_000);
    return () => {
      clearInterval(id);
      facRef.current?.destroy();
    };
  }, []);

  // Extraer color dominante del album art
  useEffect(() => {
    if (!track?.albumImage || !facRef.current) return;
    facRef.current
      .getColorAsync(track.albumImage, { crossOrigin: "anonymous" })
      .then((c) => setGlowColor(c.rgba))
      .catch(() => {});
  }, [track?.albumImage]);

  return (
    <section id="spotify" style={SECTION_STYLE}>
      <SectionTitle number="05" title="Now Playing" />

      <div style={{ display: "flex", justifyContent: "center" }}>
        <AnimatePresence mode="wait">
          {track === undefined ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SkeletonCard />
            </motion.div>
          ) : !track ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <NotPlaying />
            </motion.div>
          ) : (
            <motion.div
              key={track.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              style={{ position: "relative", width: "280px" }}
            >
              {/* Glow de color dominante */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: "-30px",
                  background: glowColor,
                  opacity: 0.12,
                  filter: "blur(50px)",
                  borderRadius: "50%",
                  pointerEvents: "none",
                  transition: "background 1s ease",
                }}
              />

              {/* Album art */}
              <div
                style={{
                  position: "relative",
                  width: "280px",
                  height: "280px",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={track.albumImage}
                  alt={`${track.title} — ${track.artist}`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="280px"
                  unoptimized
                />
              </div>

              {/* Info */}
              <div style={{ paddingTop: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faSpotify}
                    color="#1DB954"
                    width={14}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.6875rem",
                      color: "rgba(240,240,240,0.35)",
                      textTransform: "uppercase",
                      letterSpacing: "0.15em",
                    }}
                  >
                    {track.isPlaying ? "Now Playing" : "Last Played"}
                  </span>
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#f0f0f0",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    marginBottom: "0.2rem",
                  }}
                >
                  {track.title}
                </p>

                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.875rem",
                    fontWeight: 300,
                    color: "rgba(240,240,240,0.45)",
                  }}
                >
                  {track.artist}
                </p>

                {/* Barra de progreso animada — solo si está reproduciendo */}
                {track.isPlaying && (
                  <div
                    style={{
                      marginTop: "1rem",
                      height: "2px",
                      background: "rgba(255,255,255,0.08)",
                      overflow: "hidden",
                      borderRadius: "1px",
                    }}
                  >
                    <motion.div
                      key={track.title}
                      style={{ height: "100%", background: "#1DB954" }}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{
                        duration: 30,
                        ease: "linear",
                        repeat: Infinity,
                      }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
