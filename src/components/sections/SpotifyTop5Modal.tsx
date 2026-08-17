"use client";

import { motion, AnimatePresence } from "motion/react";
import Modal from "@/components/ui/Modal";
import { useLang } from "@/context/LangContext";
import { t, tr } from "@/lib/i18n";

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

export default function SpotifyTop5Modal({
  open,
  onClose,
  tracks,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  tracks: TopTrack[];
  loading: boolean;
}) {
  const { lang } = useLang();

  return (
    <Modal
      open={open}
      onClose={onClose}
      contentStyle={{
        background: "transparent",
        maxWidth: "400px",
        padding: 0,
        overflow: "hidden",
        borderRadius: "16px",
        boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
      }}
    >
      <div style={{ position: "relative", width: "100%", aspectRatio: "1/1" }}>
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/spotify-top5.png"
          alt="My Top 5"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />

        {/* Gradient overlay — fades bottom half to dark */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.92) 70%)",
          }}
        />

        {/* Track list */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "0 16px 18px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.6rem",
              color: "rgba(255,255,255,0.4)",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            {tr(t.os.spotify_top5_label, lang)}
          </p>

          {loading && (
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
              {tr(t.os.spotify_loading, lang)}
            </p>
          )}

          <AnimatePresence>
            {tracks.map((track, i) => (
              <motion.a
                key={track.id}
                href={track.songUrl}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  textDecoration: "none",
                  padding: "5px 8px",
                  borderRadius: "8px",
                  marginBottom: "4px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: "blur(6px)",
                  transition: "background 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(29,185,84,0.18)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "#1DB954",
                    width: "16px",
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={track.albumImage}
                  alt=""
                  width={32}
                  height={32}
                  style={{ borderRadius: "4px", objectFit: "cover", flexShrink: 0 }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      color: "#fff",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {track.title}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.65rem",
                      color: "rgba(255,255,255,0.45)",
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {track.artist}
                  </p>
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.62rem",
                    color: "rgba(255,255,255,0.3)",
                    flexShrink: 0,
                  }}
                >
                  {formatMs(track.durationMs)}
                </span>
              </motion.a>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  );
}
