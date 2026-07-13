"use client";

import { useState } from "react";
import MenuBar from "./MenuBar";
import { WIN_FONT } from "./shared";
import { useMiniOSStore } from "@/store/miniOsStore";
import { useScrollMemory } from "./useScrollMemory";

/** Bloc de notas funcional: escribís, wrap opcional, insertar fecha/hora. */
export default function Notepad({ onClose }: { onClose: () => void }) {
  // Persistido (sessionStorage vía Zustand): lo que escribís sigue ahí al
  // cerrar y reabrir el Notepad, o incluso después de un F5.
  const text = useMiniOSStore((s) => s.notepadText);
  const setText = useMiniOSStore((s) => s.setNotepadText);
  const [wordWrap, setWordWrap] = useState(true);
  const { ref: scrollRef, onScroll } = useScrollMemory<HTMLTextAreaElement>("notepad");

  const insertTimeDate = () => {
    const now = new Date();
    setText(`${text}${now.toLocaleTimeString()} ${now.toLocaleDateString()}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <MenuBar
        data={{
          File: [
            { type: "item", text: "New", disabled: true },
            { type: "item", text: "Open...", disabled: true },
            { type: "item", text: "Save", disabled: true },
            { type: "separator" },
            { type: "item", text: "Exit", onClick: onClose },
          ],
          Edit: [
            { type: "item", text: "Cut", disabled: true },
            { type: "item", text: "Copy", disabled: true },
            { type: "item", text: "Paste", disabled: true },
            { type: "separator" },
            { type: "item", text: "Time/Date", onClick: insertTimeDate },
          ],
          Format: [
            {
              type: "item",
              text: `Word Wrap${wordWrap ? " ✓" : ""}`,
              onClick: () => setWordWrap((w) => !w),
            },
          ],
          Help: [{ type: "item", text: "About Notepad", disabled: true }],
        }}
      />
      <textarea
        ref={scrollRef}
        onScroll={onScroll}
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        placeholder="Escribí algo..."
        style={{
          flex: 1,
          resize: "none",
          border: "none",
          outline: "none",
          padding: "0.4rem",
          fontFamily: "'Courier New', monospace",
          fontSize: "0.8rem",
          color: "#000",
          background: "#fff",
          whiteSpace: wordWrap ? "pre-wrap" : "pre",
          overflowX: wordWrap ? "hidden" : "auto",
        }}
      />
      <div
        style={{
          borderTop: "1px solid #9a9584",
          padding: "1px 6px",
          fontFamily: WIN_FONT,
          fontSize: "0.65rem",
          color: "#444",
        }}
      >
        {text.length} caracteres
      </div>
    </div>
  );
}
