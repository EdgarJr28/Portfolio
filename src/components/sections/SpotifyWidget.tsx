"use client";

import { useEffect, useState, useRef } from "react";
import { useIsMobile } from "@/components/three/useIsMobile";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { FastAverageColor } from "fast-average-color";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import SectionTitle from "@/components/ui/SectionTitle";
import SpotifyPlaylistModal from "./SpotifyPlaylistModal";

// Avatar 3D que baila al ritmo del track — carga diferida
const SpotifyAvatarCanvas = dynamic(() => import("./SpotifyAvatarCanvas"), {
  ssr: false,
  loading: () => null,
});

interface NowPlayingData {
  isPlaying: boolean;
  title: string;
  artist: string;
  albumImage: string;
  songUrl?: string;
  progressMs?: number;
  durationMs?: number;
}

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

/** Barritas de ecualizador — laten mientras suena la canción. */
function Equalizer() {
  const bars = [0, 1, 2, 3];
  return (
    <div
      aria-hidden="true"
      style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "12px" }}
    >
      {bars.map((i) => (
        <motion.span
          key={i}
          style={{
            width: "2.5px",
            borderRadius: "1px",
            background: "#1DB954",
          }}
          animate={{ height: ["30%", "100%", "45%", "80%", "30%"] }}
          transition={{
            duration: 0.9 + i * 0.15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}

function formatMs(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function SpotifyWidget() {
  const [track, setTrack] = useState<NowPlayingData | null | undefined>(
    undefined // undefined = loading, null = no track
  );
  const [glowColor, setGlowColor] = useState("rgba(0,0,0,0)");
  const [liveProgress, setLiveProgress] = useState(0);
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const facRef = useRef<FastAverageColor | null>(null);
  const fetchedAtRef = useRef(0);
  const refetchTriggeredRef = useRef(false);

  const fetchTrack = async () => {
    try {
      const res = await fetch("/api/spotify");
      const data: NowPlayingData | null = res.ok ? await res.json() : null;
      setTrack(data);
      fetchedAtRef.current = Date.now();
      setLiveProgress(data?.progressMs ?? 0);
      refetchTriggeredRef.current = false;
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

  // Progreso en vivo: interpola entre polls sumando el tiempo transcurrido.
  // Al llegar al límite de duración, se frena en el tope y pide la siguiente
  // canción de una vez (en vez de esperar al próximo poll de 30s).
  useEffect(() => {
    if (!track?.isPlaying) return;
    const duration = track.durationMs ?? 0;
    const tick = setInterval(() => {
      const elapsed = Date.now() - fetchedAtRef.current;
      const next = (track.progressMs ?? 0) + elapsed;

      if (duration > 0 && next >= duration) {
        setLiveProgress(duration);
        if (!refetchTriggeredRef.current) {
          refetchTriggeredRef.current = true;
          fetchTrack();
        }
        return;
      }
      setLiveProgress(next);
    }, 250);
    return () => clearInterval(tick);
  }, [track?.isPlaying, track?.progressMs, track?.durationMs]);

  // Extraer color dominante del album art
  useEffect(() => {
    if (!track?.albumImage || !facRef.current) return;
    facRef.current
      .getColorAsync(track.albumImage, { crossOrigin: "anonymous" })
      .then((c) => setGlowColor(c.rgba))
      .catch(() => {});
  }, [track?.albumImage]);

  const isMobile = useIsMobile();
  const duration = track?.durationMs ?? 0;
  const progressPct = duration > 0 ? Math.min(100, (liveProgress / duration) * 100) : 0;

  const seeMoreButton = (
    <button
      onClick={() => setPlaylistOpen(true)}
      style={{
        display: "inline-block",
        background: "transparent",
        border: "none",
        padding: 0,
        marginBottom: "1rem",
        fontFamily: "var(--font-body)",
        fontSize: "0.8125rem",
        color: "#1DB954",
        letterSpacing: "0.02em",
        cursor: "pointer",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
      }}
    >
      See more music →
    </button>
  );

  const CARD_W = isMobile ? 160 : 280;

  return (
    <section
      id="spotify"
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Avatar 3D fondo completo */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <SpotifyAvatarCanvas playing={!!track?.isPlaying} />
      </div>

      {/* Título */}
      <div
        style={{
          position: "absolute",
          top: isMobile ? "80px" : "96px",
          left: 0,
          right: 0,
          zIndex: 2,
          padding: "0 clamp(1.25rem, 5vw, 3rem)",
          pointerEvents: "none",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <SectionTitle number="05" title="Now Playing" />
        </div>
      </div>

      {/* Card — derecha en mobile, derecha+más centrada en desktop */}
      <div style={{ position: "relative", zIndex: 2, width: "100%", padding: isMobile ? "0 12px" : "0 clamp(1.25rem, 5vw, 3rem)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div
            style={{
              marginLeft: "auto",
              marginRight: isMobile ? "12px" : "15%",
              marginTop: isMobile ? "175px" : "175px",
              width: `${CARD_W}px`,
              textAlign: "center",
            }}
          >
            {seeMoreButton}
            <AnimatePresence mode="wait">
              {track === undefined ? (
                <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <SkeletonCard />
                </motion.div>
              ) : !track ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <NotPlaying />
                </motion.div>
              ) : (
                <motion.div
                  key={track.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  style={{ position: "relative", width: `${CARD_W}px`, textAlign: "left" }}
                >
                  <motion.div
                    aria-hidden="true"
                    animate={track.isPlaying ? { opacity: [0.1, 0.2, 0.1], scale: [1, 1.06, 1] } : { opacity: 0.1, scale: 1 }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: "absolute", inset: "-30px", background: glowColor, filter: "blur(50px)", borderRadius: "50%", pointerEvents: "none" }}
                  />
                  <motion.div
                    animate={track.isPlaying ? { scale: [1, 1.015, 1] } : { scale: 1 }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ position: "relative", width: `${CARD_W}px`, height: `${CARD_W}px`, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}
                  >
                    <Image src={track.albumImage} alt={`${track.title} — ${track.artist}`} fill style={{ objectFit: "cover" }} sizes={`${CARD_W}px`} unoptimized />
                  </motion.div>
                  <div style={{ paddingTop: "1rem", background: "rgba(10,10,10,0.55)", backdropFilter: "blur(8px)", padding: "1rem", marginTop: "0" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <FontAwesomeIcon icon={faSpotify} color="#1DB954" width={14} />
                        <span style={{ fontFamily: "var(--font-body)", fontSize: isMobile ? "0.55rem" : "0.6875rem", color: "rgba(240,240,240,0.35)", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                          {track.isPlaying ? "Now Playing" : "Last Played"}
                        </span>
                      </div>
                      {track.isPlaying && <Equalizer />}
                    </div>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: isMobile ? "0.8rem" : "1rem", fontWeight: 700, color: "#f0f0f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: "0.2rem" }}>
                      {track.title}
                    </p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: isMobile ? "0.7rem" : "0.875rem", fontWeight: 300, color: "rgba(240,240,240,0.45)" }}>
                      {track.artist}
                    </p>
                    {track.isPlaying && duration > 0 && (
                      <>
                        <div style={{ marginTop: "1rem", height: "3px", background: "rgba(255,255,255,0.08)", overflow: "hidden", borderRadius: "1px" }}>
                          <div style={{ width: `${progressPct}%`, height: "100%", background: "#1DB954", transition: "width 0.25s linear" }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.35rem", fontFamily: "var(--font-body)", fontSize: isMobile ? "0.55rem" : "0.6875rem", color: "rgba(240,240,240,0.35)" }}>
                          <span>{formatMs(liveProgress)}</span>
                          <span>{formatMs(duration)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <SpotifyPlaylistModal open={playlistOpen} onClose={() => setPlaylistOpen(false)} />
    </section>
  );
}
