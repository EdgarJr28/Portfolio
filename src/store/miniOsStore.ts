"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type AppId =
  | "paint"
  | "winamp"
  | "notepad"
  | "my-computer"
  | "minesweeper"
  | "ie"
  | "private-folder"
  | "photos"
  | "image-viewer";

export interface WinRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Recycle Bin no es una "app" real (no abre ventana, solo un diálogo falso),
// pero igual necesita poder posicionarse libremente en el escritorio.
export type DesktopIconId = AppId | "recycle-bin";

export interface IconPos {
  x: number;
  y: number;
}

interface MiniOSState {
  /** Orden = z-order: el último es el que está al frente. */
  openWindows: AppId[];
  minimizedApps: AppId[];
  recentApps: AppId[];
  /** Winamp se monta una sola vez y después queda montado (solo oculto). */
  winampMounted: boolean;
  /** La pantalla de bienvenida completa solo se muestra una vez por visita. */
  hasShownBootScreen: boolean;
  /** Última posición/tamaño "restaurado" (no maximizado) de cada ventana. */
  windowRects: Partial<Record<AppId, WinRect>>;
  /** Contenido del Notepad — sobrevive a cerrar/abrir la ventana y a un F5. */
  notepadText: string;
  /** Posición libre de cada ícono del escritorio, si el usuario lo movió. */
  desktopIconPositions: Partial<Record<DesktopIconId, IconPos>>;
  /** scrollTop de la zona scrolleable de cada app — sobrevive a cerrar/abrir la ventana. */
  scrollPositions: Partial<Record<AppId, number>>;
}

interface MiniOSActions {
  openApp: (key: AppId) => void;
  closeApp: (key: AppId) => void;
  focusApp: (key: AppId) => void;
  minimizeApp: (key: AppId) => void;
  markBootScreenShown: () => void;
  setWindowRect: (key: AppId, rect: WinRect) => void;
  setNotepadText: (text: string) => void;
  setDesktopIconPosition: (key: DesktopIconId, pos: IconPos) => void;
  setScrollPosition: (key: AppId, y: number) => void;
}

/**
 * Estado del mini-OS (easter egg de la sección About) persistido con
 * sessionStorage: las apps que quedaron abiertas siguen abiertas al volver
 * a abrir el OS, y la bienvenida completa no se repite, todo dentro de la
 * misma visita a la página (sessionStorage se limpia al cerrar la pestaña).
 * Deliberadamente afuera de este store: startMenuOpen, suspended,
 * selectedIcon, booting — esos sí queremos que arranquen "limpios" cada vez
 * que se abre el OS, así que quedan como estado local del componente.
 */
export const useMiniOSStore = create<MiniOSState & MiniOSActions>()(
  persist(
    (set) => ({
      openWindows: [],
      minimizedApps: [],
      recentApps: [],
      winampMounted: false,
      hasShownBootScreen: false,
      windowRects: {},
      notepadText: "",
      desktopIconPositions: {},
      scrollPositions: {},

      openApp: (key) =>
        set((state) => ({
          openWindows: state.openWindows.includes(key)
            ? [...state.openWindows.filter((k) => k !== key), key]
            : [...state.openWindows, key],
          minimizedApps: state.minimizedApps.filter((k) => k !== key),
          recentApps: [key, ...state.recentApps.filter((k) => k !== key)].slice(0, 5),
          winampMounted: key === "winamp" ? true : state.winampMounted,
        })),

      closeApp: (key) =>
        set((state) => ({
          openWindows: state.openWindows.filter((k) => k !== key),
          minimizedApps: state.minimizedApps.filter((k) => k !== key),
        })),

      focusApp: (key) =>
        set((state) => ({
          openWindows:
            state.openWindows[state.openWindows.length - 1] === key
              ? state.openWindows
              : [...state.openWindows.filter((k) => k !== key), key],
          minimizedApps: state.minimizedApps.filter((k) => k !== key),
        })),

      minimizeApp: (key) =>
        set((state) => ({
          minimizedApps: state.minimizedApps.includes(key)
            ? state.minimizedApps
            : [...state.minimizedApps, key],
        })),

      markBootScreenShown: () => set({ hasShownBootScreen: true }),

      setWindowRect: (key, rect) =>
        set((state) => ({ windowRects: { ...state.windowRects, [key]: rect } })),

      setNotepadText: (text) => set({ notepadText: text }),

      setDesktopIconPosition: (key, pos) =>
        set((state) => ({ desktopIconPositions: { ...state.desktopIconPositions, [key]: pos } })),

      setScrollPosition: (key, y) =>
        set((state) => ({ scrollPositions: { ...state.scrollPositions, [key]: y } })),
    }),
    {
      name: "mini-os-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
