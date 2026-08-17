"use client";

import { useEffect, useState } from "react";
import { WIN_FONT } from "./shared";

const FB_BLUE = "#3b5998";
const FB_LIGHT = "#d8dfea";
const FB_BG = "#e9ebee";
const FB_BORDER = "#b3b9c4";
const PROFILE_PIC = "/images/me.JPEG";

interface Photo { src: string; date: string }

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return iso;
  }
}

// Group photos into posts of 2-4 images each
function makePostGroups(photos: Photo[]) {
  const groups: Photo[][] = [];
  let i = 0;
  const sizes = [2, 3, 2, 4, 3, 2];
  let si = 0;
  while (i < photos.length) {
    const size = sizes[si % sizes.length];
    groups.push(photos.slice(i, i + size));
    i += size;
    si++;
  }
  return groups;
}

// ─── Post images grid ─────────────────────────────────────────────────────────

function PostImages({
  photos,
  onOpen,
}: {
  photos: Photo[];
  onOpen: (index: number) => void;
}) {
  const max = 4;
  const shown = photos.slice(0, max);
  const extra = photos.length - max;

  if (shown.length === 1) {
    return (
      <img
        src={shown[0].src}
        alt=""
        onClick={() => onOpen(0)}
        style={{ width: "100%", maxHeight: 280, objectFit: "cover", display: "block", cursor: "pointer" }}
      />
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: shown.length >= 2 ? "1fr 1fr" : "1fr",
        gridTemplateRows: shown.length >= 3 ? "130px 130px" : "160px",
        gap: 2,
      }}
    >
      {shown.map((p, i) => {
        const isLast = i === shown.length - 1 && extra > 0;
        return (
          <div
            key={i}
            onClick={() => onOpen(i)}
            style={{
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              gridColumn: shown.length === 3 && i === 0 ? "1 / 2" : undefined,
              gridRow: shown.length === 3 && i === 0 ? "1 / 3" : undefined,
            }}
          >
            <img src={p.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            {isLast && extra > 0 && (
              <div style={{
                position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontFamily: WIN_FONT, fontSize: "1.4rem", fontWeight: 700,
              }}>
                +{extra + 1}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Post ─────────────────────────────────────────────────────────────────────

const FAKE_LIKES = [23, 11, 8, 14, 6, 17, 9, 21, 5, 13];

function Post({
  photos,
  postIndex,
  onOpenViewer,
}: {
  photos: Photo[];
  postIndex: number;
  onOpenViewer: (images: string[], index: number, date: string) => void;
}) {
  const date = photos[0]?.date ? formatDate(photos[0].date) : "";
  const likes = FAKE_LIKES[postIndex % FAKE_LIKES.length];

  return (
    <div style={{ background: "#fff", border: `1px solid ${FB_BORDER}`, borderRadius: 4, marginBottom: 8, overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px" }}>
        <img src={PROFILE_PIC} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: `1px solid ${FB_BORDER}` }} />
        <div>
          <div style={{ fontFamily: WIN_FONT, fontSize: "0.72rem", fontWeight: 700, color: FB_BLUE }}>Edgar Maldonado</div>
          <div style={{ fontFamily: WIN_FONT, fontSize: "0.63rem", color: "#666" }}>{date}</div>
        </div>
      </div>
      <PostImages
        photos={photos}
        onOpen={(i) => onOpenViewer(photos.map((p) => p.src), i, date)}
      />
      <div style={{ padding: "5px 10px", borderTop: `1px solid ${FB_BORDER}`, display: "flex", gap: 12, fontFamily: WIN_FONT, fontSize: "0.65rem", color: "#555" }}>
        <span>👍 {likes} personas</span>
        <span style={{ color: FB_BLUE, cursor: "default" }}>Me gusta · Comentar</span>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const TABS = ["Muro", "Información", "Fotos", "Amigos"] as const;
type Tab = typeof TABS[number];

const FAKE_FRIENDS = ["Dios"];

export default function FacebookEasterEgg({
  onOpenViewer,
}: {
  onOpenViewer: (images: string[], index: number, date: string) => void;
}) {
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("Muro");

  useEffect(() => {
    fetch("/api/photos")
      .then((r) => r.json())
      .then((d: { photos?: Photo[] }) => setPhotos(d.photos ?? []))
      .catch(() => setPhotos([]));
  }, []);

  const groups = photos ? makePostGroups(photos) : [];
  const allSrcs = photos?.map((p) => p.src) ?? [];

  // ── Tab content renderers ──────────────────────────────────────────────────

  function renderMuro() {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "10px 12px", display: "flex", gap: 12, alignItems: "flex-start" }}>
        {/* Sidebar */}
        <div style={{ width: 160, flexShrink: 0 }}>
          <div style={{ background: "#fff", border: `1px solid ${FB_BORDER}`, borderRadius: 4, padding: 10, marginBottom: 8 }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#000", marginBottom: 6 }}>Información</div>
            <div style={{ fontSize: "0.65rem", color: "#333", lineHeight: 1.9 }}>
              <div>📍 Colombia</div>
              <div>💼 Desarrollador web</div>
              <div>🎓 Universidad</div>
            </div>
          </div>
          <div style={{ background: "#fff", border: `1px solid ${FB_BORDER}`, borderRadius: 4, padding: 10 }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#000", marginBottom: 6 }}>Amigos <span style={{ color: "#999" }}>1</span></div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ width: 36, height: 36, background: FB_LIGHT, borderRadius: 2, flexShrink: 0 }} />
              <span style={{ fontSize: "0.65rem", color: FB_BLUE }}>Dios</span>
            </div>
          </div>
        </div>
        {/* Wall */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: "#fff", border: `1px solid ${FB_BORDER}`, borderRadius: 4, padding: 10, marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <img src={PROFILE_PIC} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
              <div style={{ flex: 1, border: `1px solid ${FB_BORDER}`, borderRadius: 3, padding: "5px 8px", fontFamily: WIN_FONT, fontSize: "0.68rem", color: "#999", background: "#f9f9f9" }}>
                ¿Qué estás pensando?
              </div>
            </div>
          </div>
          {photos === null ? (
            <div style={{ fontFamily: WIN_FONT, fontSize: "0.75rem", color: "#555", padding: "1rem" }}>Cargando fotos...</div>
          ) : groups.map((group, i) => (
            <Post key={i} photos={group} postIndex={i} onOpenViewer={onOpenViewer} />
          ))}
        </div>
      </div>
    );
  }

  function renderInformacion() {
    const rows = [
      { label: "Ciudad actual", value: "Barranquilla, Colombia" },
      { label: "De", value: "Colombia" },
      { label: "Relación", value: "No especificado" },
      { label: "Trabajo", value: "Ingeniero de sistemas" },
      { label: "Educación", value: "Universidad de la Costa" },
      { label: "Se unió a Facebook", value: "enero de 2008" },
    ];
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "10px 12px" }}>
        <div style={{ background: "#fff", border: `1px solid ${FB_BORDER}`, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ background: `${FB_BLUE}22`, padding: "8px 14px", borderBottom: `1px solid ${FB_BORDER}`, fontSize: "0.75rem", fontWeight: 700, color: FB_BLUE }}>
            Información básica
          </div>
          {rows.map(({ label, value }) => (
            <div key={label} style={{ display: "flex", gap: 12, padding: "7px 14px", borderBottom: `1px solid #eee`, fontSize: "0.7rem" }}>
              <span style={{ width: 130, color: "#888", flexShrink: 0 }}>{label}</span>
              <span style={{ color: "#000" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderFotos() {
    if (photos === null) return <div style={{ padding: "1rem", fontFamily: WIN_FONT, fontSize: "0.75rem", color: "#555" }}>Cargando...</div>;
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "10px 12px" }}>
        <div style={{ background: "#fff", border: `1px solid ${FB_BORDER}`, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ background: `${FB_BLUE}22`, padding: "8px 14px", borderBottom: `1px solid ${FB_BORDER}`, fontSize: "0.75rem", fontWeight: 700, color: FB_BLUE }}>
            Fotos de Edgar ({photos.length})
          </div>
          <div style={{ padding: 10, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 4 }}>
            {photos.map((p, i) => (
              <div key={p.src} onClick={() => onOpenViewer(allSrcs, i, formatDate(p.date))} style={{ aspectRatio: "1/1", overflow: "hidden", cursor: "pointer", borderRadius: 2, border: `1px solid ${FB_BORDER}` }}>
                <img src={p.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function renderAmigos() {
    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "10px 12px" }}>
        <div style={{ background: "#fff", border: `1px solid ${FB_BORDER}`, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ background: `${FB_BLUE}22`, padding: "8px 14px", borderBottom: `1px solid ${FB_BORDER}`, fontSize: "0.75rem", fontWeight: 700, color: FB_BLUE }}>
            Amigos (1)
          </div>
          <div style={{ padding: 10, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
            {FAKE_FRIENDS.map((name) => (
              <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, padding: "8px 4px", border: `1px solid ${FB_BORDER}`, borderRadius: 4, cursor: "default" }}>
                <div style={{ width: 60, height: 60, background: FB_LIGHT, borderRadius: 3 }} />
                <span style={{ fontSize: "0.65rem", color: FB_BLUE, textAlign: "center", fontFamily: WIN_FONT }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ background: FB_BG, minHeight: "100%", fontFamily: WIN_FONT }}>
      {/* Top bar */}
      <div style={{ background: FB_BLUE, padding: "4px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem", fontFamily: "Georgia, serif", letterSpacing: -0.5 }}>facebook</span>
        <input placeholder="Buscar en Facebook" readOnly style={{ padding: "2px 8px", borderRadius: 3, border: "none", fontFamily: WIN_FONT, fontSize: "0.68rem", width: 180, outline: "none" }} />
        <span style={{ color: "#d8dfea", fontSize: "0.65rem" }}>Edgar Maldonado · Cerrar sesión</span>
      </div>

      {/* Profile header */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${FB_BORDER}` }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "16px 12px 0", display: "flex", gap: 16, alignItems: "flex-end" }}>
          <img
            src={PROFILE_PIC}
            alt="Edgar Maldonado"
            onClick={() => onOpenViewer([PROFILE_PIC], 0, "Foto de perfil")}
            style={{ width: 90, height: 90, objectFit: "cover", border: "3px solid #fff", boxShadow: `0 0 0 1px ${FB_BORDER}`, borderRadius: 2, flexShrink: 0, cursor: "pointer" }}
          />
          <div style={{ paddingBottom: 10 }}>
            <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#000" }}>Edgar Maldonado</div>
            <div style={{ fontSize: "0.7rem", color: "#666", marginTop: 2 }}>{photos ? photos.length : "..."} fotos · Colombia</div>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", paddingLeft: 12, borderTop: `1px solid ${FB_BORDER}`, marginTop: 8 }}>
          {TABS.map((tab) => {
            const active = tab === activeTab;
            return (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "6px 12px", fontFamily: WIN_FONT, fontSize: "0.7rem",
                  fontWeight: active ? 700 : 400,
                  color: active ? FB_BLUE : "#555",
                  borderBottom: active ? `3px solid ${FB_BLUE}` : "3px solid transparent",
                  cursor: "pointer",
                  userSelect: "none",
                }}
              >
                {tab}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "Muro"        && renderMuro()}
      {activeTab === "Información" && renderInformacion()}
      {activeTab === "Fotos"       && renderFotos()}
      {activeTab === "Amigos"      && renderAmigos()}
    </div>
  );
}
