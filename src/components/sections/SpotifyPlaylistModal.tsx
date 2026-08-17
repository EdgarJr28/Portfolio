"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import Modal from "@/components/ui/Modal";
import { useLang } from "@/context/LangContext";
import { t, tr } from "@/lib/i18n";

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

interface TopTrack {
  id: string;
  title: string;
  artist: string;
  albumImage: string;
  songUrl: string;
  durationMs: number;
}

function formatMs(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

const RANK_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32", "rgba(255,255,255,0.5)", "rgba(255,255,255,0.35)"];

function Top5Card({ tracks }: { tracks: TopTrack[] }) {
  const { lang } = useLang();
  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", borderRadius: "12px", overflow: "hidden", boxShadow: "0 24px 48px rgba(0,0,0,0.65)" }}>
      {/* BG image */}
      <Image
        src="/images/spotify-top5.png"
        alt="My Top 5"
        fill
        sizes="(max-width: 768px) 90vw, 420px"
        style={{ objectFit: "cover" }}
      />
      {/* Multi-stop gradient: keep image visible on top half, solid dark on bottom */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0.82) 55%, rgba(0,0,0,0.97) 75%)" }} />

      {/* Content */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "14px 14px 16px" }}>
        {/* Label */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "10px" }}>
          <FontAwesomeIcon icon={faSpotify} color="#1DB954" width={11} />
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.56rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.22em" }}>
            {tr(t.os.spotify_top5_label, lang)}
          </span>
        </div>

        {/* Track list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {tracks.map((track, i) => (
            <a
              key={track.id}
              href={track.songUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                textDecoration: "none",
                padding: "5px 8px",
                borderRadius: "8px",
                background: i === 0 ? "rgba(255,215,0,0.08)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${i === 0 ? "rgba(255,215,0,0.18)" : "rgba(255,255,255,0.07)"}`,
                backdropFilter: "blur(8px)",
                transition: "background 0.18s, border-color 0.18s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(29,185,84,0.18)";
                e.currentTarget.style.borderColor = "rgba(29,185,84,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = i === 0 ? "rgba(255,215,0,0.08)" : "rgba(255,255,255,0.04)";
                e.currentTarget.style.borderColor = i === 0 ? "rgba(255,215,0,0.18)" : "rgba(255,255,255,0.07)";
              }}
            >
              {/* Rank */}
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: i < 3 ? "0.88rem" : "0.72rem",
                fontWeight: 800,
                color: RANK_COLORS[i],
                width: "16px",
                textAlign: "center",
                flexShrink: 0,
                lineHeight: 1,
              }}>
                {i + 1}
              </span>

              {/* Album art */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={track.albumImage}
                alt=""
                width={34}
                height={34}
                style={{
                  borderRadius: "4px",
                  objectFit: "cover",
                  flexShrink: 0,
                  boxShadow: i === 0 ? "0 0 0 1.5px rgba(255,215,0,0.4)" : "none",
                }}
              />

              {/* Title + artist */}
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.73rem",
                  fontWeight: 600,
                  color: i === 0 ? "#ffe580" : "#fff",
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  lineHeight: 1.2,
                }}>
                  {track.title}
                </p>
                <p style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.6rem",
                  color: "rgba(255,255,255,0.38)",
                  margin: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  marginTop: "2px",
                }}>
                  {track.artist}
                </p>
              </div>

              {/* Duration */}
              <span style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.58rem",
                color: "rgba(255,255,255,0.28)",
                flexShrink: 0,
              }}>
                {formatMs(track.durationMs)}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SpotifyPlaylistModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { lang } = useLang();
  const [data, setData] = useState<PlaylistData | null | undefined>(undefined);
  const [topTracks, setTopTracks] = useState<TopTrack[] | undefined>(undefined);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const dragXRef = useRef(0);
  const justDraggedRef = useRef(false);

  const goTo = (next: number, dir: number) => {
    setDirection(dir);
    setIndex(next);
  };

  const handleClose = () => {
    if (justDraggedRef.current) return;
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    setData(undefined);
    setTopTracks(undefined);
    setIndex(0);

    fetch("/api/playlist")
      .then((res) => (res.ok ? res.json() : null))
      .then(setData)
      .catch(() => setData(null));

    fetch("/api/spotify/top-tracks")
      .then((res) => res.json())
      .then((d: { tracks?: TopTrack[] }) => setTopTracks(d.tracks ?? []))
      .catch(() => setTopTracks([]));
  }, [open]);

  const bothLoaded = data !== undefined && topTracks !== undefined;
  const totalSlides = ((topTracks?.length ?? 0) > 0 ? 1 : 0) + (data?.playlists?.length ?? 0);

  // Slide 0 = Top5 card (si hay tracks), luego playlists
  const isTop5Slide = (topTracks?.length ?? 0) > 0 && index === 0;
  const playlistIndex = (topTracks?.length ?? 0) > 0 ? index - 1 : index;
  const playlist = !isTop5Slide ? data?.playlists?.[playlistIndex] : undefined;
  const showContent = bothLoaded && (isTop5Slide || !!playlist);

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
        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(240,240,240,0.5)" }}>
          {tr(t.os.spotify_playlists, lang)}
        </span>
      </div>

      {data?.ownerName && (
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "#1DB954", marginBottom: "1.5rem" }}>
          {data.ownerName}
        </p>
      )}

      {!bothLoaded && (
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "rgba(240,240,240,0.4)", padding: "2rem 0" }}>
          {tr(t.os.spotify_loading, lang)}
        </p>
      )}

      {data === null && bothLoaded && (
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8125rem", color: "rgba(240,240,240,0.4)", padding: "2rem 0" }}>
          {tr(t.os.spotify_error, lang)}
        </p>
      )}

      {showContent && (
        <>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onPointerDown={() => { dragXRef.current = 0; }}
              onDragStart={() => { justDraggedRef.current = true; }}
              onDrag={(_, info) => { dragXRef.current = info.offset.x; }}
              onDragEnd={(_, info) => {
                const threshold = 60;
                if (info.offset.x < -threshold) goTo((index + 1) % totalSlides, 1);
                else if (info.offset.x > threshold) goTo((index - 1 + totalSlides) % totalSlides, -1);
                setTimeout(() => { justDraggedRef.current = false; }, 100);
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
              style={{ cursor: "grab", touchAction: "pan-y", WebkitUserDrag: "none", userSelect: "none" } as React.CSSProperties}
              whileTap={{ cursor: "grabbing" }}
            >
              {isTop5Slide ? (
                <Top5Card tracks={topTracks} />
              ) : playlist ? (
                <a
                  href={playlist.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  onClick={(e) => { if (Math.abs(dragXRef.current) > 8) e.preventDefault(); }}
                  style={{ display: "block", textDecoration: "none", perspective: "1100px", WebkitUserDrag: "none", userSelect: "none" } as React.CSSProperties}
                >
                  <motion.div
                    whileHover={{ scale: 1.04, rotateY: 10, rotateX: 6 }}
                    style={{ position: "relative", width: "100%", aspectRatio: "1/1", borderRadius: "8px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
                  >
                    <Image src={playlist.image} alt={playlist.name} fill style={{ objectFit: "cover" }} sizes="380px" unoptimized draggable={false} />
                  </motion.div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 700, color: "#f0f0f0", textAlign: "center", marginTop: "1rem" }}>
                    {playlist.name}
                  </p>
                  {playlist.description && (
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "rgba(240,240,240,0.4)", textAlign: "center", marginTop: "0.25rem" }}>
                      {playlist.description}
                    </p>
                  )}
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.6875rem", color: "rgba(240,240,240,0.3)", textAlign: "center", marginTop: "0.2rem" }}>
                    {playlist.trackCount} tracks
                  </p>
                </a>
              ) : null}
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: "0.4rem", marginTop: "1.25rem" }}>
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > index ? 1 : -1)}
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
