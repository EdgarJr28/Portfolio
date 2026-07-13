"use client";

import { useState } from "react";
import MenuBar from "./MenuBar";
import { WIN_FONT } from "./shared";
import { useScrollMemory } from "./useScrollMemory";

const ICONS = "/images/os/icons/mycomputer";
const SOCIAL_ICONS = "/images/social";

interface Shortcut {
  label: string;
  sectionId: string;
}

// Secciones reales del portfolio, mostradas como carpetas "guardadas en esta
// computadora" — igual que la ventana My Computer del repo de referencia.
const SHORTCUTS: Shortcut[] = [
  { label: "About Me", sectionId: "about" },
  { label: "Skills", sectionId: "skills" },
  { label: "Experience", sectionId: "experience" },
  { label: "Projects", sectionId: "projects" },
  { label: "Contact", sectionId: "contact" },
];

const SOCIALS = [
  { icon: `${SOCIAL_ICONS}/github.svg`, href: "https://github.com/EdgarJr28", label: "GitHub" },
  { icon: `${SOCIAL_ICONS}/linkedin.svg`, href: "https://linkedin.com/in/edgar-maldonado-5619171a0", label: "LinkedIn" },
  { icon: `${SOCIAL_ICONS}/twitter.svg`, href: "https://x.com/ed__28", label: "X (Twitter)" },
  { icon: `${SOCIAL_ICONS}/instagram.svg`, href: "https://instagram.com/ed__2898", label: "Instagram" },
];

const SIDEBAR_TEXT = "#0c327d";

function CardHeader({ text }: { text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "23px",
        padding: "0 2px 0 11px",
        background: "linear-gradient(to right, rgb(240,240,255) 0%, rgb(240,240,255) 30%, rgb(168,188,255) 100%)",
      }}
    >
      <span style={{ flex: 1, fontWeight: 700, fontSize: "0.68rem", color: SIDEBAR_TEXT }}>{text}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${ICONS}/pullup.png`} alt="" width={14} height={14} draggable={false} />
    </div>
  );
}

function SidebarRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="mc-row" style={{ display: "flex", marginBottom: "2px", cursor: "default" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={icon} alt="" width={13} height={13} draggable={false} style={{ marginRight: "5px" }} />
      <span style={{ fontSize: "0.62rem", lineHeight: "14px", color: SIDEBAR_TEXT }}>{text}</span>
    </div>
  );
}

/**
 * "Mi PC" calcado de la ventana My Computer del repo de referencia
 * (toolbar + function bar + address bar + panel lateral azul + contenido),
 * pero con contenido propio: las carpetas son las secciones reales del
 * portfolio y "About Me" enlaza a mis redes de verdad en vez de las del
 * autor original.
 */
export default function MyComputer({
  onClose,
  onShutdown,
}: {
  onClose: () => void;
  onShutdown: () => void;
}) {
  const [funcHover, setFuncHover] = useState<string | null>(null);
  const { ref: scrollRef, onScroll } = useScrollMemory<HTMLDivElement>("my-computer");

  const goTo = (sectionId: string) => {
    onShutdown();
    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  const funcBtnStyle = (key: string): React.CSSProperties => ({
    display: "flex",
    height: "100%",
    alignItems: "center",
    padding: "0 4px",
    borderRadius: "3px",
    border: `1px solid ${funcHover === key ? "rgba(0,0,0,0.1)" : "transparent"}`,
    boxShadow: funcHover === key ? "inset 0 -1px 1px rgba(0,0,0,0.1)" : "none",
    cursor: "default",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "linear-gradient(to right, #edede5 0%, #ede8cd 100%)",
        fontFamily: WIN_FONT,
      }}
    >
      <style>{`.mc-link:hover { color: #2b72ff !important; text-decoration: underline; cursor: pointer; }`}</style>

      {/* Barra de menú + logo de Windows */}
      <div style={{ display: "flex", alignItems: "center", height: "24px", borderBottom: "1px solid rgba(255,255,255,0.7)", flexShrink: 0 }}>
        <div style={{ flex: 1 }}>
          <MenuBar
            data={{
              File: [{ type: "item", text: "Close", onClick: onClose }],
              Edit: [{ type: "item", text: "Select All", disabled: true }],
              View: [{ type: "item", text: "Large Icons", disabled: true }],
              Favorites: [{ type: "item", text: "Add to Favorites", disabled: true }],
              Tools: [{ type: "item", text: "Folder Options", disabled: true }],
              Help: [{ type: "item", text: "About", disabled: true }],
            }}
          />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${ICONS}/windows.png`}
          alt=""
          style={{ height: "100%", borderLeft: "1px solid #fff", borderBottom: "1px solid rgba(0,0,0,0.1)" }}
        />
      </div>

      {/* Barra de funciones (decorativa, igual que en el repo original) */}
      <div
        style={{
          height: "36px",
          display: "flex",
          alignItems: "center",
          gap: "2px",
          fontSize: "0.68rem",
          padding: "1px 3px 0",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", height: "100%", alignItems: "center", filter: "grayscale(1)", opacity: 0.7 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ICONS}/back.png`} alt="" width={30} height={30} draggable={false} />
          <span style={{ marginRight: "4px", color: SIDEBAR_TEXT }}>Back</span>
        </div>
        <div style={{ display: "flex", height: "100%", alignItems: "center", filter: "grayscale(1)", opacity: 0.7 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ICONS}/forward.png`} alt="" width={30} height={30} draggable={false} />
        </div>
        <div style={funcBtnStyle("up")} onMouseEnter={() => setFuncHover("up")} onMouseLeave={() => setFuncHover(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ICONS}/up.png`} alt="" width={22} height={22} draggable={false} />
        </div>
        <div style={{ width: "1px", height: "90%", background: "rgba(0,0,0,0.2)", margin: "0 2px" }} />
        <div style={funcBtnStyle("search")} onMouseEnter={() => setFuncHover("search")} onMouseLeave={() => setFuncHover(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ICONS}/search.png`} alt="" width={22} height={22} draggable={false} style={{ margin: "0 4px 0 1px" }} />
          <span style={{ color: SIDEBAR_TEXT }}>Search</span>
        </div>
        <div style={funcBtnStyle("folders")} onMouseEnter={() => setFuncHover("folders")} onMouseLeave={() => setFuncHover(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/os/icons/folder-open2-32.png" alt="" width={22} height={22} draggable={false} style={{ margin: "0 4px 0 1px" }} />
          <span style={{ color: SIDEBAR_TEXT }}>Folders</span>
        </div>
        <div style={{ width: "1px", height: "90%", background: "rgba(0,0,0,0.2)", margin: "0 2px" }} />
        <div style={funcBtnStyle("menu")} onMouseEnter={() => setFuncHover("menu")} onMouseLeave={() => setFuncHover(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ICONS}/menu.png`} alt="" width={22} height={22} draggable={false} style={{ margin: "0 1px 0 2px" }} />
        </div>
      </div>

      {/* Barra de dirección */}
      <div
        style={{
          flexShrink: 0,
          borderTop: "1px solid rgba(255,255,255,0.7)",
          height: "20px",
          fontSize: "0.62rem",
          display: "flex",
          alignItems: "center",
          padding: "0 2px",
          boxShadow: "inset 0 -2px 3px -1px #b0b0b0",
        }}
      >
        <span style={{ color: "rgba(0,0,0,0.5)", padding: "0 5px" }}>Address</span>
        <div
          style={{
            border: "1px solid rgba(122,122,255,0.6)",
            height: "100%",
            flex: 1,
            display: "flex",
            alignItems: "center",
            background: "#fff",
            position: "relative",
            padding: "0 16px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/os/icons/computer-16.png"
            alt=""
            width={14}
            height={14}
            draggable={false}
            style={{ position: "absolute", left: "1px" }}
          />
          <span style={{ whiteSpace: "nowrap", color: "#000" }}>My Computer</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${ICONS}/dropdown.png`}
            alt=""
            width={15}
            height={15}
            draggable={false}
            style={{ position: "absolute", right: "1px" }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", padding: "0 18px 0 5px", height: "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ICONS}/go.png`} alt="" style={{ height: "95%", border: "1px solid rgba(255,255,255,0.2)", marginRight: "3px" }} />
          <span style={{ color: SIDEBAR_TEXT }}>Go</span>
        </div>
      </div>

      {/* Contenido: panel azul + panel blanco */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        data-mos-scroll
        style={{ flex: 1, minHeight: 0, border: "1px solid rgba(0,0,0,0.4)", borderTopWidth: 0, background: "#f1f1f1", overflow: "auto", fontSize: "0.62rem", display: "flex" }}
      >
        <div
          style={{
            width: "170px",
            flexShrink: 0,
            background: "linear-gradient(to bottom, #748aff 0%, #4057d3 100%)",
            overflow: "auto",
            padding: "10px",
          }}
        >
          <div style={{ marginBottom: "12px", borderRadius: "3px", overflow: "hidden" }}>
            <CardHeader text="System Tasks" />
            <div style={{ padding: "5px 10px", background: "rgba(198,211,255,0.87)" }}>
              <div className="mc-row mc-link" style={{ display: "flex", marginBottom: "2px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${ICONS}/view-info.ico`} alt="" width={13} height={13} style={{ marginRight: "5px" }} />
                <span style={{ fontSize: "0.62rem", color: SIDEBAR_TEXT }}>View system information</span>
              </div>
              <SidebarRow icon={`${ICONS}/remove.png`} text="Add or remove programs" />
              <SidebarRow icon={`${ICONS}/control-16.png`} text="Change a setting" />
            </div>
          </div>

          <div style={{ marginBottom: "12px", borderRadius: "3px", overflow: "hidden" }}>
            <CardHeader text="Other Places" />
            <div style={{ padding: "5px 10px", background: "rgba(198,211,255,0.87)" }}>
              <SidebarRow icon={`${ICONS}/network.png`} text="My Network Places" />
              <SidebarRow icon={`${ICONS}/documents-16.png`} text="My Documents" />
              <SidebarRow icon="/images/os/icons/folder-closed2-16.png" text="Shared Documents" />
              <SidebarRow icon={`${ICONS}/control-16.png`} text="Control Panel" />
            </div>
          </div>

          <div style={{ borderRadius: "3px", overflow: "hidden" }}>
            <CardHeader text="Details" />
            <div style={{ padding: "5px 10px", background: "rgba(198,211,255,0.87)" }}>
              <p style={{ margin: "0 0 4px", fontSize: "0.6rem", color: SIDEBAR_TEXT, lineHeight: 1.4 }}>
                Hecho con Next.js, React Three Fiber &amp; Tailwind.
              </p>
              <a
                href="https://github.com/EdgarJr28"
                target="_blank"
                rel="noreferrer"
                className="mc-link"
                style={{ fontSize: "0.6rem", color: SIDEBAR_TEXT, textDecoration: "none" }}
              >
                Ver el código fuente →
              </a>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, background: "#fff", overflow: "auto" }}>
          <div style={{ width: "300px", fontWeight: 700, fontSize: "0.66rem", padding: "6px 0 3px 12px", position: "relative", color: "#000" }}>
            Files Stored on This Computer
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, #70bfff 0, #fff 100%)" }} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", padding: "15px 15px 4px" }}>
            {SHORTCUTS.map((s) => (
              <button
                key={s.sectionId}
                onDoubleClick={() => goTo(s.sectionId)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "160px",
                  marginBottom: "15px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/os/icons/folder-closed2-48.png" alt="" width={40} height={40} draggable={false} style={{ marginRight: "5px" }} />
                <span style={{ fontSize: "0.66rem", color: "#000" }}>{s.label}</span>
              </button>
            ))}
          </div>

          <div style={{ width: "300px", fontWeight: 700, fontSize: "0.66rem", padding: "6px 0 3px 12px", position: "relative", color: "#000" }}>
            Hard Disk Drives
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, #70bfff 0, #fff 100%)" }} />
          </div>
          <div style={{ display: "flex", padding: "15px 15px 4px" }}>
            <div style={{ display: "flex", alignItems: "center", width: "160px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${ICONS}/disk.png`} alt="" width={40} height={40} draggable={false} style={{ marginRight: "5px" }} />
              <span style={{ fontSize: "0.66rem", color: "#000" }}>Local Disk (C:)</span>
            </div>
          </div>

          <div style={{ width: "300px", fontWeight: 700, fontSize: "0.66rem", padding: "6px 0 3px 12px", position: "relative", color: "#000" }}>
            Devices with Removable Storage
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, #70bfff 0, #fff 100%)" }} />
          </div>
          <div style={{ display: "flex", padding: "15px 15px 4px" }}>
            <div style={{ display: "flex", alignItems: "center", width: "160px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${ICONS}/cd.png`} alt="" width={40} height={40} draggable={false} style={{ marginRight: "5px" }} />
              <span style={{ fontSize: "0.66rem", color: "#000" }}>CD Drive (D:)</span>
            </div>
          </div>

          <div style={{ width: "300px", fontWeight: 700, fontSize: "0.66rem", padding: "6px 0 3px 12px", position: "relative", color: "#000" }}>
            About Me :)
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, #70bfff 0, #fff 100%)" }} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", padding: "15px 15px 4px" }}>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="mc-social"
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "160px",
                  marginBottom: "15px",
                  textDecoration: "none",
                  color: "#000",
                }}
              >
                <span
                  style={{
                    width: "40px",
                    height: "40px",
                    marginRight: "5px",
                    borderRadius: "8px",
                    background: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(0,0,0,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.icon} alt="" width={26} height={26} draggable={false} />
                </span>
                <span style={{ fontSize: "0.66rem" }}>{s.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
