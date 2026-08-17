"use client";

import { useRef, useState } from "react";
import { WIN_FONT } from "./shared";
import { useLang } from "@/context/LangContext";
import { t, tr } from "@/lib/i18n";

export interface GameDef {
  id: string;
  title: string;
  genre: string;
  /** Flash SWF via Ruffle */
  swfPath?: string;
  /** SNES/GBA/NES ROM via EmulatorJS */
  romPath?: string;
  /** EmulatorJS core id, e.g. "snes9x", "mgba", "fceumm" */
  core?: string;
}

function gamePlayerSrc(game: GameDef): string {
  if (game.romPath) {
    return `/emulatorjs/player.html?rom=${encodeURIComponent(game.romPath)}&core=${game.core ?? "snes9x"}&name=${encodeURIComponent(game.title)}`;
  }
  return `/ruffle/player.html?swf=${encodeURIComponent(game.swfPath ?? "")}`;
}

export const GAMES: GameDef[] = [
  {
    id: "sihirli-ayak",
    title: "Retrocesos Mágicos",
    swfPath: "/games/SihirliAyak.swf",
    genre: "arcade",
  },
  {
    id: "top-gear",
    title: "Top Gear",
    romPath: "/roms/TopGear.sfc",
    core: "snes9x",
    genre: "racing",
  },
  {
    id: "sims-bustin-out",
    title: "The Sims: Bustin' Out",
    romPath: "/roms/SimsBustinOut.gba",
    core: "mgba",
    genre: "sim",
  },
  {
    id: "pokemon-esmeralda",
    title: "Pokémon Esmeralda",
    romPath: "/roms/PokemonEsmeralda.gba",
    core: "mgba",
    genre: "rpg",
  },
];

function localizeGenre(genre: string, lang: "es" | "en"): string {
  if (genre === "racing") return tr(t.os.genre_racing, lang);
  if (genre === "sim")    return tr(t.os.genre_sim, lang);
  if (genre === "rpg")    return "RPG";
  return "Arcade";
}

export default function GamesFolder({
  onOpenGame,
}: {
  onOpenGame: (swfPath: string) => void;
}) {
  const { lang } = useLang();
  const [selected, setSelected] = useState<string | null>(null);
  const lastTapRef = useRef<{ id: string; t: number } | null>(null);

  return (
    <div style={{ height: "100%", background: "#fff", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          padding: "0.5rem 0.7rem",
          borderBottom: "1px solid #9a9584",
          fontFamily: WIN_FONT,
          fontSize: "0.72rem",
          color: "#000",
          fontWeight: 700,
        }}
      >
        {tr(t.os.games_folder, lang)} ({GAMES.length})
      </div>

      <div
        style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "1rem" }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setSelected(null);
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: "0.6rem",
          }}
        >
          {GAMES.map((game) => {
            const isSelected = selected === game.id;
            return (
              <button
                key={game.id}
                onClick={() => {
                  const now = Date.now();
                  const last = lastTapRef.current;
                  if (last && last.id === game.id && now - last.t < 350) {
                    onOpenGame(gamePlayerSrc(game));
                    lastTapRef.current = null;
                  } else {
                    setSelected(game.id);
                    lastTapRef.current = { id: game.id, t: now };
                  }
                }}
                onDoubleClick={() => onOpenGame(gamePlayerSrc(game))}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.4rem",
                  padding: "0.6rem 0.4rem",
                  border: isSelected ? "1px solid #0a3aa8" : "1px solid transparent",
                  borderRadius: "3px",
                  background: isSelected ? "#cbe3ff" : "transparent",
                  boxShadow: isSelected ? "0 0 0 1px rgba(11,97,255,0.3)" : "none",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #1a5276 0%, #2e86c1 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.6rem",
                    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.4)",
                  }}
                >
                  🕹️
                </div>
                <span
                  style={{
                    fontFamily: WIN_FONT,
                    fontSize: "0.68rem",
                    color: "#000",
                    lineHeight: 1.3,
                    wordBreak: "break-word",
                  }}
                >
                  {game.title}
                </span>
                <span
                  style={{
                    fontFamily: WIN_FONT,
                    fontSize: "0.6rem",
                    color: "#666",
                  }}
                >
                  {localizeGenre(game.genre, lang)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid #9a9584",
          padding: "2px 8px",
          fontFamily: WIN_FONT,
          fontSize: "0.65rem",
          color: "#444",
          background: "#ece9d8",
        }}
      >
        {selected
          ? `${GAMES.find((g) => g.id === selected)?.title} — ${tr(t.os.dbl_open, lang)}`
          : `${GAMES.length} ${GAMES.length !== 1 ? tr(t.os.obj_plural, lang) : tr(t.os.obj_singular, lang)}`}
      </div>
    </div>
  );
}
