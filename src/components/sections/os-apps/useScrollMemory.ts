"use client";

import { useEffect, useRef } from "react";
import { useMiniOSStore, type AppId } from "@/store/miniOsStore";

/**
 * Recuerda el scrollTop de la zona scrolleable de una app del mini-OS
 * (persistido en sessionStorage vía el store) — así al cerrar y volver a
 * abrir la ventana (o después de un F5) el scroll queda donde lo dejaste,
 * en vez de arrancar siempre desde arriba. El guardado va debounced: no
 * escribimos al store en cada evento de scroll, solo cuando el usuario deja
 * de scrollear un rato.
 */
export function useScrollMemory<T extends HTMLElement>(appId: AppId, ready: readonly unknown[] = []) {
  const setScrollPosition = useMiniOSStore((s) => s.setScrollPosition);
  const ref = useRef<T>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const el = ref.current;
    const savedTop = useMiniOSStore.getState().scrollPositions[appId];
    if (el && savedTop) el.scrollTop = savedTop;
    // "ready" deja reintentar la restauración una vez que el contenido
    // async (ej. fotos cargadas por fetch) ya está en el DOM — antes de eso
    // scrollHeight es 0 y el scrollTop se clampearía a 0 sin efecto.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, ready);

  // Al desmontar (cerrar la ventana, o un remount inesperado) guardamos la
  // posición actual YA, sin esperar el debounce — si el desmontaje ocurre
  // antes de que el timeout dispare, esa última posición se perdería del
  // todo y al reabrir arrancaría de 0 en vez de donde quedó.
  useEffect(() => {
    const el = ref.current;
    return () => {
      clearTimeout(debounceRef.current);
      if (el) setScrollPosition(appId, el.scrollTop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId]);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    clearTimeout(debounceRef.current);
    const top = el.scrollTop;
    debounceRef.current = setTimeout(() => setScrollPosition(appId, top), 200);
  };

  return { ref, onScroll };
}
