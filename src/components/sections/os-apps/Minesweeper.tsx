"use client";

import { useEffect, useRef, useState } from "react";
import { WIN_FONT } from "./shared";

const ROWS = 9;
const COLS = 9;
const MINES = 10;

interface Cell {
  isMine: boolean;
  adjacent: number;
  revealed: boolean;
  flagged: boolean;
}

type GameStatus = "ready" | "playing" | "won" | "lost";

function emptyBoard(): Cell[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      isMine: false,
      adjacent: 0,
      revealed: false,
      flagged: false,
    }))
  );
}

function neighbors(r: number, c: number): [number, number][] {
  const out: [number, number][] = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) out.push([nr, nc]);
    }
  }
  return out;
}

function placeMines(board: Cell[][], safeR: number, safeC: number) {
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (board[r][c].isMine) continue;
    if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue;
    board[r][c].isMine = true;
    placed++;
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].isMine) continue;
      board[r][c].adjacent = neighbors(r, c).filter(([nr, nc]) => board[nr][nc].isMine).length;
    }
  }
}

function floodReveal(board: Cell[][], r: number, c: number) {
  const cell = board[r][c];
  if (cell.revealed || cell.flagged) return;
  cell.revealed = true;
  if (cell.adjacent === 0 && !cell.isMine) {
    for (const [nr, nc] of neighbors(r, c)) floodReveal(board, nr, nc);
  }
}

const NUMBER_COLORS: Record<number, string> = {
  1: "#0000ff",
  2: "#008000",
  3: "#ff0000",
  4: "#000080",
  5: "#800000",
  6: "#008080",
  7: "#000000",
  8: "#808080",
};

function Digits({ value }: { value: number }) {
  const clamped = Math.max(-99, Math.min(999, value));
  const text = (clamped < 0 ? "-" + String(-clamped).padStart(2, "0") : String(clamped).padStart(3, "0"));
  return (
    <div
      style={{
        background: "#000",
        color: "#ff0000",
        fontFamily: "'Courier New', monospace",
        fontWeight: 700,
        fontSize: "1.1rem",
        padding: "1px 4px",
        letterSpacing: "1px",
        border: "1px solid #7b7b7b",
        minWidth: "38px",
        textAlign: "right",
      }}
    >
      {text}
    </div>
  );
}

/** Buscaminas clásico: 9x9, 10 minas, click izquierdo revela / derecho marca. */
export default function Minesweeper() {
  const [board, setBoard] = useState<Cell[][]>(emptyBoard);
  const [status, setStatus] = useState<GameStatus>("ready");
  const [time, setTime] = useState(0);
  const [face, setFace] = useState<"smile" | "scared" | "dead" | "cool">("smile");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === "playing") {
      timerRef.current = setInterval(() => setTime((t) => Math.min(999, t + 1)), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  const reset = () => {
    setBoard(emptyBoard());
    setStatus("ready");
    setTime(0);
    setFace("smile");
  };

  const flaggedCount = board.flat().filter((c) => c.flagged).length;

  const revealAllMines = (b: Cell[][]) => {
    for (const row of b) for (const cell of row) if (cell.isMine) cell.revealed = true;
  };

  const onCellClick = (r: number, c: number) => {
    if (status === "won" || status === "lost") return;
    const next = board.map((row) => row.map((cell) => ({ ...cell })));
    if (status === "ready") {
      placeMines(next, r, c);
      setStatus("playing");
    }
    const cell = next[r][c];
    if (cell.flagged || cell.revealed) return;

    if (cell.isMine) {
      cell.revealed = true;
      revealAllMines(next);
      setBoard(next);
      setStatus("lost");
      setFace("dead");
      return;
    }

    floodReveal(next, r, c);
    setBoard(next);

    const won = next.every((row) => row.every((cl) => cl.isMine || cl.revealed));
    if (won) {
      setStatus("won");
      setFace("cool");
    }
  };

  const onCellRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (status === "won" || status === "lost") return;
    const next = board.map((row) => row.map((cell) => ({ ...cell })));
    const cell = next[r][c];
    if (!cell.revealed) cell.flagged = !cell.flagged;
    setBoard(next);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "6px",
        background: "#c0c0c0",
        height: "100%",
        boxSizing: "border-box",
        userSelect: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: `${COLS * 20 + 8}px`,
          background: "#c0c0c0",
          border: "2px inset #fff",
          padding: "4px 6px",
          marginBottom: "6px",
        }}
      >
        <Digits value={MINES - flaggedCount} />
        <button
          onClick={reset}
          onMouseDown={() => status !== "won" && status !== "lost" && setFace("scared")}
          onMouseUp={() => status !== "won" && status !== "lost" && setFace("smile")}
          style={{
            width: "26px",
            height: "26px",
            fontSize: "1rem",
            border: "2px outset #fff",
            background: "#c0c0c0",
            cursor: "pointer",
          }}
          aria-label="Reiniciar"
        >
          {face === "smile" ? "🙂" : face === "scared" ? "😮" : face === "dead" ? "😵" : "😎"}
        </button>
        <Digits value={time} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${COLS}, 20px)`,
          gridTemplateRows: `repeat(${ROWS}, 20px)`,
          border: "3px inset #fff",
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => onCellClick(r, c)}
              onContextMenu={(e) => onCellRightClick(e, r, c)}
              style={{
                width: "20px",
                height: "20px",
                padding: 0,
                fontFamily: WIN_FONT,
                fontWeight: 700,
                fontSize: "0.7rem",
                lineHeight: "20px",
                textAlign: "center",
                cursor: "pointer",
                background: cell.revealed ? "#c0c0c0" : "#c0c0c0",
                border: cell.revealed ? "1px solid #808080" : "2px outset #fff",
                color: cell.revealed && !cell.isMine ? NUMBER_COLORS[cell.adjacent] : undefined,
              }}
            >
              {cell.revealed
                ? cell.isMine
                  ? "💣"
                  : cell.adjacent > 0
                  ? cell.adjacent
                  : ""
                : cell.flagged
                ? "🚩"
                : ""}
            </button>
          ))
        )}
      </div>

      {(status === "won" || status === "lost") && (
        <p style={{ fontFamily: WIN_FONT, fontSize: "0.75rem", marginTop: "0.5rem" }}>
          {status === "won" ? "¡Ganaste! 🎉" : "Pisaste una mina."}
        </p>
      )}
    </div>
  );
}
