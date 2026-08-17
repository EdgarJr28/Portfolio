"use client";

import { useEffect } from "react";

const SUPPRESS = ["THREE.Clock"];

export default function SuppressWarnings() {
  useEffect(() => {
    const orig = console.warn.bind(console);
    console.warn = (...args: unknown[]) => {
      if (typeof args[0] === "string" && SUPPRESS.some((s) => args[0].includes(s))) return;
      orig(...args);
    };
    return () => { console.warn = orig; };
  }, []);
  return null;
}
