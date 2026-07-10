"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

interface TypewriterProps {
  phrases: string[];
  typingSpeed?: number;
  pauseTime?: number;
  style?: CSSProperties;
}

/**
 * Texto tipo terminal: escribe cada frase, pausa, borra, pasa a la siguiente.
 * Si el texto no cabe en el contenedor, la "cámara" lo sigue (scroll
 * horizontal automático) para que el cursor de escritura siempre sea visible,
 * en vez de cortarlo con "...".
 */
export default function Typewriter({
  phrases,
  typingSpeed = 100,
  pauseTime = 3000,
  style,
}: TypewriterProps) {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const current = phrases[phraseIndex % phrases.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), typingSpeed);
    } else if (!deleting && text.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), pauseTime);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), typingSpeed / 2);
    } else {
      setDeleting(false);
      setPhraseIndex((i) => (i + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, phraseIndex, phrases, typingSpeed, pauseTime]);

  // "Cámara" sigue el cursor: si el texto se desborda, desplaza para que
  // el final (donde se está escribiendo) quede siempre a la vista.
  useLayoutEffect(() => {
    const container = containerRef.current;
    const el = textRef.current;
    if (!container || !el) return;
    const overflow = el.scrollWidth - container.clientWidth;
    setOffset(overflow > 0 ? overflow : 0);
  }, [text]);

  return (
    <div ref={containerRef} style={{ overflow: "hidden", width: "100%" }}>
      <span
        ref={textRef}
        style={{
          ...style,
          display: "inline-block",
          whiteSpace: "nowrap",
          transform: `translateX(-${offset}px)`,
          transition: "transform 0.1s linear",
        }}
      >
        {text}
        <span style={{ opacity: 0.6 }}>▌</span>
      </span>
    </div>
  );
}
