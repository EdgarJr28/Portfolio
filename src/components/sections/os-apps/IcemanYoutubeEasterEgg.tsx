"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faThumbsUp,
  faThumbsDown,
  faFlag,
  faShare,
  faMagnifyingGlass,
  faExpand,
  faCompress,
} from "@fortawesome/free-solid-svg-icons";
const VIDEO_SRC = encodeURI("/easter/iceman/ICEMAN VIDEO EASTEREGG.mp4");
const THUMB_SRC = "/easter/iceman/Ed.png";

const SANS = "Arial, Helvetica, sans-serif";

const RELATED = [
  { title: "cold plunge fail compilation lol", views: "482,910 views" },
  { title: "how to survive winter (funny)", views: "112,004 views" },
  { title: "tutorial como dormir", views: "3,201,884 views" },
  { title: "penguin walks into a bar", views: "58,332 views" },
];

const COMMENTS = [
  { user: "xXcool_kid2008Xx", text: "lmaooo this is the best thing ive seen all week", time: "2 days ago" },
  { user: "sk8ergurl", text: "why is this so real though", time: "5 days ago" },
  { user: "anon_1994", text: "5 stars, add to favorites", time: "1 week ago" },
];

/**
 * Easter egg del buscador fake: buscar "iceman" reproduce el video real del
 * easter egg (mismo que la placa clickeable en la sección About) dentro de
 * una plantilla inspirada en un sitio de videos circa 2008. Nombre y logo
 * inventados a propósito ("ClipTube") en vez del branding real de YouTube,
 * que es una marca registrada — mismo criterio que "buscador fake" con
 * Google.
 */
export default function IcemanYoutubeEasterEgg() {
  const [rating] = useState(5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [paneSize, setPaneSize] = useState<{ w: number; h: number } | null>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Nunca dejamos que el video pida fullscreen real del navegador (ej. por
  // el menú contextual) — si algo lo dispara igual, lo cancelamos al toque.
  // El botón de pantalla completa de acá abajo es propio: expande el video
  // dentro de la ventana del mini-OS, nunca fuera de ella.
  useEffect(() => {
    const onFsChange = () => {
      if (document.fullscreenElement === videoRef.current) {
        document.exitFullscreen().catch(() => {});
      }
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Mientras está en "pantalla completa" (dentro de la ventana), seguimos el
  // tamaño real del panel scrolleable de la ventana — así si la ventana se
  // redimensiona, el reproductor se re-escala con ella en vez de quedarse
  // con las dimensiones que tenía al activarlo.
  useEffect(() => {
    if (!isFullscreen) return;
    const scrollPane = videoWrapRef.current?.closest("[data-mos-scroll]") as HTMLElement | null;
    if (!scrollPane) return;
    const update = () => setPaneSize({ w: scrollPane.clientWidth, h: scrollPane.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(scrollPane);
    return () => ro.disconnect();
  }, [isFullscreen]);

  return (
    <div style={{ background: "#fff", fontFamily: SANS, color: "#000", minHeight: "100%" }}>
      {/* Header estilo 2008: franja roja arriba, logo + tagline, buscador */}
      <div style={{ background: "linear-gradient(180deg, #b31217 0%, #8f0e12 100%)", padding: "0.5rem 1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              background: "#fff",
              borderRadius: "4px",
              padding: "0.15rem 0.6rem",
              display: "flex",
              alignItems: "baseline",
              gap: "1px",
            }}
          >
            <span style={{ fontSize: "1.3rem", fontWeight: 700, color: "#444" }}>You</span>
            <span style={{ fontSize: "1.3rem", fontWeight: 700, color: "#cc1a1a" }}>Tube</span>
          </div>
          <span style={{ fontSize: "0.65rem", fontStyle: "italic", color: "#f3d9d9" }}>
            Broadcast Yourself™
          </span>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", background: "#fff", borderRadius: "3px", overflow: "hidden" }}>
            <input
              defaultValue="iceman"
              readOnly
              style={{ border: "none", outline: "none", padding: "0.3rem 0.5rem", fontSize: "0.72rem", width: "160px", fontFamily: SANS }}
            />
            <button
              style={{
                background: "#e2e2e2",
                border: "none",
                padding: "0.35rem 0.6rem",
                cursor: "default",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} width={11} color="#444" />
            </button>
          </div>
        </div>
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", fontSize: "0.68rem" }}>
          {["Home", "Videos", "Channels", "Community"].map((tab, i) => (
            <span
              key={tab}
              style={{
                color: "#fff",
                fontWeight: i === 1 ? 700 : 400,
                borderBottom: i === 1 ? "2px solid #fff" : "none",
                paddingBottom: "0.2rem",
              }}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      {/* Cuerpo: video + info a la izquierda, relacionados a la derecha */}
      <div style={{ display: "flex", gap: "1rem", padding: "0.9rem" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            ref={videoWrapRef}
            style={
              isFullscreen
                ? {
                    position: "sticky",
                    top: 0,
                    zIndex: 30,
                    width: paneSize?.w ?? "100%",
                    height: paneSize?.h ?? "60vh",
                    background: "#000",
                  }
                : { position: "relative" }
            }
          >
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              poster={THUMB_SRC}
              controls
              controlsList="nofullscreen"
              disablePictureInPicture
              autoPlay
              style={
                isFullscreen
                  ? { width: "100%", height: "100%", objectFit: "contain", background: "#000", display: "block" }
                  : { width: "100%", background: "#000", display: "block", border: "1px solid #999" }
              }
            />
            <button
              onClick={() => setIsFullscreen((v) => !v)}
              aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              style={{
                position: "absolute",
                bottom: "44px",
                right: "8px",
                zIndex: 31,
                background: "rgba(0,0,0,0.6)",
                border: "none",
                borderRadius: "3px",
                padding: "0.35rem 0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} width={11} color="#fff" />
            </button>
          </div>

          <h1 style={{ fontSize: "1rem", fontWeight: 700, margin: "0.6rem 0 0.2rem", color: "#000" }}>
            ICEMAN VIDEO EASTEREGG (2008)
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", fontSize: "0.68rem", color: "#555", borderBottom: "1px solid #e5e5e5", paddingBottom: "0.5rem" }}>
            <span>14,209 views</span>
            <span style={{ display: "flex", gap: "1px" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} width={10} color={i < rating ? "#e8b900" : "#ccc"} />
              ))}
            </span>
            <span>127 ratings</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.6rem 0", borderBottom: "1px solid #e5e5e5" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={THUMB_SRC} alt="" width={32} height={32} style={{ borderRadius: "3px", objectFit: "cover" }} />
              <div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#1a4faa" }}>edmaldonado</div>
                <div style={{ fontSize: "0.62rem", color: "#888" }}>127 subscribers</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.6rem", fontSize: "0.65rem", color: "#555" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <FontAwesomeIcon icon={faThumbsUp} width={11} /> Like
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <FontAwesomeIcon icon={faThumbsDown} width={11} /> Dislike
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <FontAwesomeIcon icon={faShare} width={11} /> Share
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <FontAwesomeIcon icon={faFlag} width={11} /> Flag
              </span>
            </div>
          </div>

          <p style={{ fontSize: "0.72rem", color: "#333", lineHeight: 1.6, margin: "0.6rem 0" }}>
            grabado con lo que tenía a mano jajaja no se supone que nadie vea esto todavía
          </p>

          <div style={{ marginTop: "1rem" }}>
            <h2 style={{ fontSize: "0.78rem", fontWeight: 700, borderBottom: "1px solid #e5e5e5", paddingBottom: "0.4rem" }}>
              3 comments
            </h2>
            {COMMENTS.map((c) => (
              <div key={c.user} style={{ display: "flex", gap: "0.5rem", padding: "0.6rem 0", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ width: "26px", height: "26px", background: "#ccc", borderRadius: "2px", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "0.68rem" }}>
                    <span style={{ fontWeight: 700, color: "#1a4faa" }}>{c.user}</span>{" "}
                    <span style={{ color: "#999" }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#333", marginTop: "0.15rem" }}>{c.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: relacionados */}
        <div style={{ width: "200px", flexShrink: 0 }}>
          <h2 style={{ fontSize: "0.72rem", fontWeight: 700, color: "#555", marginBottom: "0.5rem" }}>
            Related Videos
          </h2>
          {RELATED.map((r) => (
            <div key={r.title} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.7rem" }}>
              <div style={{ width: "68px", height: "50px", background: "#ddd", flexShrink: 0, border: "1px solid #ccc" }} />
              <div>
                <div style={{ fontSize: "0.66rem", color: "#1a4faa", lineHeight: 1.3 }}>{r.title}</div>
                <div style={{ fontSize: "0.6rem", color: "#888" }}>{r.views}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
