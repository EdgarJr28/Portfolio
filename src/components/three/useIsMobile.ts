"use client";

import { useSyncExternalStore } from "react";

// Mismo breakpoint "md" que usa el resto del sitio (Tailwind).
const QUERY = "(max-width: 767px)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/**
 * ¿Estamos en el layout mobile? Reactivo (cambia si se rota el dispositivo o
 * se redimensiona la ventana), SSR-safe. Lo usan las escenas 3D que necesitan
 * un encuadre de cámara distinto cuando su canvas pasa de ocupar toda la
 * pantalla (desktop) a una caja compacta (mobile) — la relación de aspecto
 * cambia demasiado para que la misma cámara sirva en los dos casos.
 */
export function useIsMobile() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
