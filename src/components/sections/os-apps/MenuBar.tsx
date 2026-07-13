"use client";

import { useEffect, useState } from "react";
import { WIN_FONT, WIN_BODY_BG, type MenuData } from "./shared";

/** Barra de menú estilo XP (File/Edit/...) con dropdowns clásicos. */
export default function MenuBar({ data }: { data: MenuData }) {
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = () => setOpen(null);
    window.addEventListener("mousedown", onDocClick);
    return () => window.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div
      style={{
        display: "flex",
        gap: "0.1rem",
        padding: "2px 4px",
        background: WIN_BODY_BG,
        fontFamily: WIN_FONT,
        fontSize: "0.72rem",
        position: "relative",
        borderBottom: "1px solid #9a9584",
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {Object.entries(data).map(([label, items]) => (
        <div key={label} style={{ position: "relative" }}>
          <button
            onClick={() => setOpen((o) => (o === label ? null : label))}
            style={{
              background: open === label ? "#316ac5" : "transparent",
              color: open === label ? "#fff" : "#000",
              border: "none",
              padding: "2px 6px",
              cursor: "pointer",
              fontFamily: WIN_FONT,
              fontSize: "0.72rem",
            }}
          >
            {label}
          </button>
          {open === label && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                minWidth: "170px",
                background: "#fff",
                border: "1px solid #868686",
                boxShadow: "2px 2px 6px rgba(0,0,0,0.3)",
                zIndex: 50,
                padding: "2px 0",
              }}
            >
              {items.map((item, i) =>
                item.type === "separator" ? (
                  <div
                    key={i}
                    style={{ height: "1px", background: "#d4d0c8", margin: "3px 2px" }}
                  />
                ) : (
                  <button
                    key={item.text}
                    disabled={item.disabled}
                    onClick={() => {
                      item.onClick?.();
                      setOpen(null);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "3px 20px",
                      background: "transparent",
                      border: "none",
                      color: item.disabled ? "#a3a3a3" : "#000",
                      cursor: item.disabled ? "default" : "pointer",
                      fontFamily: WIN_FONT,
                      fontSize: "0.72rem",
                    }}
                    onMouseEnter={(e) => {
                      if (!item.disabled) e.currentTarget.style.background = "#316ac5";
                      if (!item.disabled) e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = item.disabled ? "#a3a3a3" : "#000";
                    }}
                  >
                    {item.text}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
