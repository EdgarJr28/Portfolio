"use client";

import { Component, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { useIsMobile } from "@/components/three/useIsMobile";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faMoon,
  faArrowTrendUp,
  faTriangleExclamation,
  faChevronRight,
  faListUl,
} from "@fortawesome/free-solid-svg-icons";
import type WebampType from "webamp";
import Notepad from "./os-apps/Notepad";
import MyComputer from "./os-apps/MyComputer";
import Minesweeper from "./os-apps/Minesweeper";
import InternetExplorer from "./os-apps/InternetExplorer";
import PrivateFolder from "./os-apps/PrivateFolder";
import PhotosFolder from "./os-apps/PhotosFolder";
import ImageViewer from "./os-apps/ImageViewer";
import {
  useMiniOSStore,
  type AppId,
  type WinRect,
  type DesktopIconId,
} from "@/store/miniOsStore";

const ICONS = "/images/os/icons";

// Metadata para íconos de escritorio, taskbar y menú de inicio. Los bitmaps
// vienen de github.com/ShizukuIchi/winXP (MIT, ver public/images/os/icons/CREDITS.md).
const APP_META: Record<
  AppId,
  { label: string; icon: string; iconSmall: string }
> = {
  paint: {
    label: "Paint",
    icon: `${ICONS}/paint-32.png`,
    iconSmall: `${ICONS}/paint-16.png`,
  },
  winamp: {
    label: "Winamp",
    icon: `${ICONS}/winamp.png`,
    iconSmall: `${ICONS}/winamp.png`,
  },
  notepad: {
    label: "Notepad",
    icon: `${ICONS}/notepad-32.png`,
    iconSmall: `${ICONS}/notepad-16.png`,
  },
  "my-computer": {
    label: "My Computer",
    icon: `${ICONS}/computer-32.png`,
    iconSmall: `${ICONS}/computer-16.png`,
  },
  minesweeper: {
    label: "Minesweeper",
    icon: `${ICONS}/mine-icon.png`,
    iconSmall: `${ICONS}/mine-icon.png`,
  },
  ie: {
    label: "Internet Explorer",
    icon: `${ICONS}/ie.png`,
    iconSmall: `${ICONS}/ie-paper.png`,
  },
  "private-folder": {
    label: "Privado",
    icon: `${ICONS}/lock-32.png`,
    iconSmall: `${ICONS}/lock-16.png`,
  },
  photos: {
    label: "Fotos",
    icon: `${ICONS}/photos-folder-32.png`,
    iconSmall: `${ICONS}/photos-folder-32.png`,
  },
  "image-viewer": {
    label: "imágenes",
    icon: `${ICONS}/photos-folder-32.png`,
    iconSmall: `${ICONS}/photos-folder-32.png`,
  },
};

// Apps con ventana/iframe estándar (todo menos Winamp, que maneja su propia
// UI flotante sin nuestro chrome — igual que en el repo original).
const IFRAME_APPS: Partial<Record<AppId, string>> = {
  paint: "https://jspaint.app",
};

// Pistas de muestra del demo oficial de Webamp (mismas que usa
// github.com/ShizukuIchi/winXP).
const WEBAMP_ALBUM = "netBloc Vol. 24: tiuqottigeloot";
const WEBAMP_TRACKS = [
  {
    url: "https://raw.githubusercontent.com/captbaritone/webamp-music/4b556fbf/Diablo_Swing_Orchestra_-_01_-_Heroines.mp3",
    duration: 322.612245,
    metaData: { title: "Heroines", artist: "Diablo Swing Orchestra", album: WEBAMP_ALBUM },
  },
  {
    url: "https://raw.githubusercontent.com/captbaritone/webamp-music/4b556fbf/Eclectek_-_02_-_We_Are_Going_To_Eclecfunk_Your_Ass.mp3",
    duration: 190.093061,
    metaData: { title: "We Are Going To Eclecfunk Your Ass", artist: "Eclectek", album: WEBAMP_ALBUM },
  },
  {
    url: "https://raw.githubusercontent.com/captbaritone/webamp-music/4b556fbf/Auto-Pilot_-_03_-_Seventeen.mp3",
    duration: 214.622041,
    metaData: { title: "Seventeen", artist: "Auto-Pilot", album: WEBAMP_ALBUM },
  },
  {
    url: "https://raw.githubusercontent.com/captbaritone/webamp-music/4b556fbf/Muha_-_04_-_Microphone.mp3",
    duration: 181.838367,
    metaData: { title: "Microphone", artist: "Muha", album: WEBAMP_ALBUM },
  },
  {
    url: "https://raw.githubusercontent.com/captbaritone/webamp-music/4b556fbf/Just_Plain_Ant_-_05_-_Stumble.mp3",
    duration: 86.047347,
    metaData: { title: "Stumble", artist: "Just Plain Ant", album: WEBAMP_ALBUM },
  },
  {
    url: "https://raw.githubusercontent.com/captbaritone/webamp-music/4b556fbf/Sleaze_-_06_-_God_Damn.mp3",
    duration: 226.795102,
    metaData: { title: "God Damn", artist: "Sleaze", album: WEBAMP_ALBUM },
  },
];

// Widget decorativo del menú de inicio — contenido de muestra, no viene de
// una API real.
const TRENDING_ITEMS = [
  "React 20 llega con Compiler estable por defecto",
  "WebGPU ya corre en todos los navegadores mayores",
  "TypeScript 6.0: inferencia más rápida en monorepos",
];

// Todas las apps del mini-OS, para el flyout "All Programs" del menú de
// inicio (incluye las que ya están fijadas arriba, igual que en Windows real).
const ALL_PROGRAMS: AppId[] = ["ie", "winamp", "notepad", "paint", "my-computer", "minesweeper"];

const MIN_WIDTH = 340;
const MIN_HEIGHT = 260;
const TASKBAR_HEIGHT = 30;
const BASE_Z = 50;
const CASCADE_OFFSET = 28;
const WIN_FONT = "'Tahoma', 'Segoe UI', Verdana, sans-serif";
const WIN_BODY_BG = "#ece9d8"; // fondo de ventana estilo XP (beige claro)

// Orden de los íconos del escritorio cuando no tienen posición guardada.
const DESKTOP_ICON_ORDER: DesktopIconId[] = [
  "recycle-bin",
  "winamp",
  "paint",
  "notepad",
  "my-computer",
  "minesweeper",
  "ie",
  "private-folder",
  "photos",
];

const ICON_COL_SPACING = 100;
const ICON_ROW_SPACING = 100;
const ICON_MARGIN = 20;

// Cuántos íconos entran por columna según el alto real de la pantalla —
// con un número fijo (antes 8), en pantallas bajas (móvil apaisado,
// laptops chicas) la última fila quedaba metida debajo de la taskbar.
function iconsPerColumn(): number {
  const usable = window.innerHeight - TASKBAR_HEIGHT - ICON_MARGIN;
  return Math.max(3, Math.floor(usable / ICON_ROW_SPACING));
}

// Por defecto los íconos se acomodan en columnas verticales (de arriba
// hacia abajo, como un escritorio real) — pero cualquiera se puede
// arrastrar a otra posición, que después queda guardada por separado.
function getDefaultIconPos(index: number): { x: number; y: number } {
  const perCol = iconsPerColumn();
  const col = Math.floor(index / perCol);
  const row = index % perCol;
  return {
    x: ICON_MARGIN + col * ICON_COL_SPACING,
    y: ICON_MARGIN + row * ICON_ROW_SPACING,
  };
}

const ICON_FOOTPRINT_W = 84;
const ICON_FOOTPRINT_H = 90;

// Mientras se arrastra un ícono, no lo dejamos salir de la pantalla visible
// (ni por arriba/izquierda, ni tapado por la taskbar abajo/a la derecha).
function clampIconPos(x: number, y: number): { x: number; y: number } {
  const maxX = Math.max(0, window.innerWidth - ICON_FOOTPRINT_W);
  const maxY = Math.max(0, window.innerHeight - TASKBAR_HEIGHT - ICON_FOOTPRINT_H);
  return {
    x: Math.min(Math.max(x, 0), maxX),
    y: Math.min(Math.max(y, 0), maxY),
  };
}

// Al soltar, la posición se "engancha" a la cuadrícula (misma grilla que
// usan las posiciones por defecto) en vez de quedar en cualquier pixel.
function snapIconPosToGrid(x: number, y: number): { x: number; y: number } {
  const col = Math.round((x - ICON_MARGIN) / ICON_COL_SPACING);
  const row = Math.round((y - ICON_MARGIN) / ICON_ROW_SPACING);
  return clampIconPos(
    ICON_MARGIN + Math.max(0, col) * ICON_COL_SPACING,
    ICON_MARGIN + Math.max(0, row) * ICON_ROW_SPACING
  );
}

// Gradientes/valores calcados de https://github.com/ShizukuIchi/winXP
// (mismo tema "Luna"), reimplementados acá porque ese repo estiliza con
// styled-components — nosotros lo resolvemos con un <style> con clases
// propias, prefijadas "mos-" para no chocar con el resto del sitio.
const MINI_OS_CSS = `
/* La scrollbar global del sitio es de 4px (pensada para el resto de la
   página, con mouse fino) — adentro del mini-OS usamos una más ancha y
   clickeable, estilo Windows clásico. Con :where() para que gane sobre la
   regla global sin necesitar !important. */
:where(.mini-os-open) .mos-content::-webkit-scrollbar,
:where(.mini-os-open) [data-mos-scroll]::-webkit-scrollbar {
  width: 16px;
  height: 16px;
}
:where(.mini-os-open) .mos-content::-webkit-scrollbar-track,
:where(.mini-os-open) [data-mos-scroll]::-webkit-scrollbar-track {
  background: #ece9d8;
  border-left: 1px solid #9a9584;
}
:where(.mini-os-open) .mos-content::-webkit-scrollbar-thumb,
:where(.mini-os-open) [data-mos-scroll]::-webkit-scrollbar-thumb {
  /* Textura a rayas sobre el degradé — sin esto el thumb se confundía
     visualmente con el track (mismos tonos beige/gris). */
  background-image:
    repeating-linear-gradient(
      to bottom,
      rgba(0,0,0,0.18) 0,
      rgba(0,0,0,0.18) 2px,
      transparent 2px,
      transparent 5px
    ),
    linear-gradient(180deg, #f7f6f0 0%, #d8d3c2 50%, #bdb69f 100%);
  background-blend-mode: multiply;
  border: 1px solid #8a8471;
  border-radius: 2px;
}
:where(.mini-os-open) .mos-content::-webkit-scrollbar-thumb:hover,
:where(.mini-os-open) [data-mos-scroll]::-webkit-scrollbar-thumb:hover {
  background-image:
    repeating-linear-gradient(
      to bottom,
      rgba(0,0,0,0.18) 0,
      rgba(0,0,0,0.18) 2px,
      transparent 2px,
      transparent 5px
    ),
    linear-gradient(180deg, #fff 0%, #e3ded0 50%, #cfc8ae 100%);
}
.mos-winamp-host {
  pointer-events: none;
}
.mos-winamp-host > * {
  pointer-events: auto;
}
.mos-window {
  padding: 3px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 3px 3px 10px rgba(0,0,0,0.5);
}
.mos-window.focus { background-color: #0831d9; }
.mos-window.mos-unfocused { background-color: #6582f5; }
.mos-window.maximized { border-radius: 0; }

.mos-header-bg {
  position: relative;
  left: 0; top: 0; right: 0;
  height: 28px;
  flex-shrink: 0;
  pointer-events: none;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  overflow: hidden;
}
.mos-window.maximized .mos-header-bg { border-radius: 0; }
.mos-header-bg.focus {
  background: linear-gradient(to bottom,#0058ee 0%,#3593ff 4%,#288eff 6%,#127dff 8%,#036ffc 10%,#0262ee 14%,#0057e5 20%,#0054e3 24%,#0055eb 56%,#005bf5 66%,#026afe 76%,#0062ef 86%,#0052d6 92%,#0040ab 94%,#003092 100%);
}
.mos-header-bg.mos-unfocused {
  background: linear-gradient(to bottom, #7697e7 0%,#7e9ee3 3%,#94afe8 6%,#97b4e9 8%,#82a5e4 14%,#7c9fe2 17%,#7996de 25%,#7b99e1 56%,#82a9e9 81%,#80a5e7 89%,#7b96e1 94%,#7a93df 97%,#abbae3 100%);
}
.mos-header-bg::before {
  content: '';
  display: block;
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 15px;
  background: linear-gradient(to right, #1638e6 0%, transparent 100%);
}
.mos-header-bg.mos-unfocused::before { opacity: 0.3; }
.mos-header-bg::after {
  content: '';
  display: block;
  position: absolute;
  right: 0; top: 0; bottom: 0;
  width: 15px;
  background: linear-gradient(to left, #1638e6 0%, transparent 100%);
}
.mos-header-bg.mos-unfocused::after { opacity: 0.4; }

.mos-header {
  position: absolute;
  left: 3px; right: 3px; top: 3px;
  height: 25px;
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 12px;
  font-family: ${WIN_FONT};
  text-shadow: 1px 1px #000;
  color: #fff;
  cursor: grab;
  touch-action: none;
  user-select: none;
}
.mos-window.maximized .mos-header { cursor: default; }
.mos-header-title {
  flex: 1;
  min-width: 0;
  pointer-events: none;
  padding-right: 5px;
  letter-spacing: 0.5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.mos-header-btns {
  display: flex;
  align-items: center;
  gap: 1px;
}
.mos-header-btns.mos-unfocused { opacity: 0.6; }
.mos-header-btn {
  position: relative;
  width: 20px;
  height: 20px;
  border: 1px solid #fff;
  border-radius: 3px;
  cursor: pointer;
  padding: 0;
}
.mos-header-btn:hover { filter: brightness(120%); }
.mos-header-btn:active { filter: brightness(90%); }
.mos-header-btn--minimize, .mos-header-btn--maximize, .mos-header-btn--maximized {
  box-shadow: inset 0 -1px 2px 1px #4646ff;
  background-image: radial-gradient(circle at 90% 90%, #0054e9 0%, #2263d5 55%, #4479e4 70%, #a3bbec 90%, white 100%);
}
.mos-header-btn--minimize::before {
  content: '';
  position: absolute;
  left: 4px; top: 12px;
  height: 3px; width: 9px;
  background-color: white;
}
.mos-header-btn--maximize::before {
  content: '';
  position: absolute;
  display: block;
  left: 4px; top: 4px;
  box-shadow: inset 0 3px white, inset 0 0 0 1px white;
  height: 11px; width: 11px;
}
.mos-header-btn--maximized::before {
  content: '';
  position: absolute;
  display: block;
  left: 7px; top: 4px;
  box-shadow: inset 0 2px white, inset 0 0 0 1px white;
  height: 8px; width: 8px;
}
.mos-header-btn--maximized::after {
  content: '';
  position: absolute;
  display: block;
  left: 4px; top: 7px;
  box-shadow: inset 0 2px white, inset 0 0 0 1px white, 1px -1px #136dff;
  height: 8px; width: 8px;
  background-color: #136dff;
}
.mos-header-btn--close {
  box-shadow: inset 0 -1px 2px 1px #da4600;
  background-image: radial-gradient(circle at 90% 90%, #cc4600 0%, #dc6527 55%, #cd7546 70%, #ffccb2 90%, white 100%);
}
.mos-header-btn--close::before, .mos-header-btn--close::after {
  content: '';
  position: absolute;
  left: 9px; top: 2px;
  height: 15px; width: 2px;
  background-color: white;
}
.mos-header-btn--close::before { transform: rotate(45deg); }
.mos-header-btn--close::after { transform: rotate(-45deg); }

.mos-content {
  flex: 1;
  /* Sin esto, un flex item por defecto no se achica más allá de lo que
     mida su contenido (min-height:auto) — el overflow:auto de acá abajo
     nunca llegaba a activarse porque el contenido simplemente empujaba el
     alto real más allá del espacio disponible, y ".mos-window" (que tiene
     overflow:hidden) lo recortaba de golpe en vez de dejarlo scrollear. */
  min-height: 0;
  position: relative;
  background: ${WIN_BODY_BG};
  color: #000;
  padding: 3px;
  overflow: auto;
}

.mos-taskbar {
  height: ${TASKBAR_HEIGHT}px;
  background: linear-gradient(to bottom, #1f2f86 0, #3165c4 3%, #3682e5 6%, #4490e6 10%, #3883e5 12%, #2b71e0 15%, #2663da 18%, #235bd6 20%, #2258d5 23%, #2157d6 38%, #245ddb 54%, #2562df 86%, #245fdc 89%, #2158d4 92%, #1d4ec0 95%, #1941a5 98%);
  display: flex;
  align-items: center;
}
.mos-taskbar-left {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  gap: 4px;
  padding: 0 6px;
}
.mos-taskbar-tray {
  background: linear-gradient(to bottom, #0c59b9 1%, #139ee9 6%, #18b5f2 10%, #139beb 14%, #1290e8 19%, #0d8dea 63%, #0d9ff1 81%, #0f9eed 88%, #119be9 91%, #1392e2 94%, #137ed7 97%, #095bc9 100%);
  border-left: 1px solid #1042af;
  box-shadow: inset 1px 0 1px #18bbff;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 10px;
  flex-shrink: 0;
  font-family: ${WIN_FONT};
  font-size: 11px;
  color: #fff;
  text-shadow: none;
}
.mos-start-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 24px;
  padding: 0 10px 0 4px;
  border-radius: 4px 8px 8px 4px;
  border: none;
  cursor: pointer;
  font-family: ${WIN_FONT};
  font-weight: 700;
  font-style: italic;
  font-size: 13px;
  color: #fff;
  text-shadow: 1px 1px 1px rgba(0,0,0,0.4);
  background: linear-gradient(to bottom, #6da531 0%, #8cc63f 8%, #7cba32 50%, #5b9c22 92%, #4c8a19 100%);
  box-shadow: inset 0 0 0 1px #2c5c0e, inset 0 1px 0 rgba(255,255,255,0.5);
  flex-shrink: 0;
}
.mos-start-btn:hover { filter: brightness(108%); }
.mos-start-btn.open {
  filter: brightness(85%);
  box-shadow: inset 1px 1px 3px rgba(0,0,0,0.5);
}
.mos-task-btn {
  flex: 1;
  max-width: 150px;
  min-width: 40px;
  color: #fff;
  border-radius: 2px;
  padding: 0 8px;
  height: 22px;
  font-family: ${WIN_FONT};
  font-size: 11px;
  background-color: #3c81f3;
  box-shadow: inset -1px 0 rgba(0,0,0,0.3), inset 1px 1px 1px rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border: none;
}
.mos-task-btn:hover:not(.focus) { background-color: #53a3ff; }
.mos-task-btn.focus {
  background-color: #1e52b7;
  box-shadow: inset 0 0 1px 1px rgba(0,0,0,0.2), inset 1px 0 1px rgba(0,0,0,0.7);
}
.mos-task-btn.focus:hover { background-color: #3576f3; }
`;

// Tamaño "natural" de cada app al abrirla — no todas necesitan la misma
// ventana gigante (Minesweeper es un tablero chico, Notepad no necesita
// tanto alto, etc.), igual que en Windows real cada programa pide el tamaño
// que le sirve a su contenido.
const APP_DEFAULT_SIZE: Record<AppId, { width: number; height: number }> = {
  paint: { width: 820, height: 640 },
  winamp: { width: 0, height: 0 }, // Winamp no pasa por AppWindow — no aplica.
  notepad: { width: 560, height: 440 },
  "my-computer": { width: 660, height: 500 },
  minesweeper: { width: 340, height: 420 },
  ie: { width: 760, height: 580 },
  "private-folder": { width: 380, height: 320 },
  photos: { width: 560, height: 460 },
  "image-viewer": { width: 640, height: 520 },
};

function initialRect(appId: AppId, cascadeIndex: number): WinRect {
  const base = APP_DEFAULT_SIZE[appId];
  const width = Math.min(base.width, window.innerWidth * 0.92);
  const height = Math.min(base.height, window.innerHeight * 0.88);
  const offset = (cascadeIndex % 5) * CASCADE_OFFSET;
  return {
    width,
    height,
    x: Math.max(8, (window.innerWidth - width) / 2 + offset),
    y: Math.max(16, (window.innerHeight - TASKBAR_HEIGHT - height) / 2 + offset),
  };
}

function useClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// Sintetiza el clásico "ding" de notificación de Windows con Web Audio API
// (dos tonos cortos ascendentes) — evita reproducir el sonido real de
// Microsoft/MSN Messenger, que tiene copyright y no es libre para reusar.
function playNotificationChime() {
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AudioCtx();
  const now = ctx.currentTime;

  const playTone = (freq: number, start: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, now + start);
    gain.gain.linearRampToValueAtTime(0.2, now + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + start);
    osc.stop(now + start + duration);
  };

  playTone(830, 0, 0.22);
  playTone(1245, 0.14, 0.3);

  setTimeout(() => ctx.close(), 800);
}

function useOnlineStatus() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    setOnline(navigator.onLine);
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);
  return online;
}

interface NetworkInfo {
  ip: string;
  city: string;
  country: string;
}

// La consulta se hace directo desde el navegador del visitante (no pasa por
// nuestro servidor) — así ipapi.co detecta su IP pública real, no la
// nuestra. Solo se usa para mostrárselo a él mismo en el globo del tray, no
// se guarda ni se manda a ningún lado.
function useNetworkInfo(enabled: boolean) {
  const [info, setInfo] = useState<NetworkInfo | null>(null);
  useEffect(() => {
    if (!enabled || info) return;
    let cancelled = false;
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setInfo({
          ip: data.ip ?? "?",
          city: data.city ?? "",
          country: data.country_name ?? "",
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [enabled, info]);
  return info;
}

function DesktopIcon({
  label,
  icon,
  iconColor = "#f4f4f4",
  tile,
  selected,
  onSelect,
  onOpen,
  x,
  y,
  onDragEnd,
}: {
  label: string;
  icon: string | IconDefinition;
  iconColor?: string;
  tile?: string;
  selected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  x: number;
  y: number;
  onDragEnd: (pos: { x: number; y: number }) => void;
}) {
  const [pos, setPos] = useState({ x, y });
  // Si la posición guardada cambia desde afuera (por ejemplo al cargar el
  // store persistido), sincronizamos — pero no mientras se está arrastrando.
  const draggingRef = useRef(false);
  const lastTapRef = useRef(0);
  useEffect(() => {
    if (!draggingRef.current) setPos({ x, y });
  }, [x, y]);

  const onPointerDown = (e: React.PointerEvent) => {
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = pos;
    let moved = false;

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        moved = true;
        draggingRef.current = true;
      }
      if (moved) {
        setPos(clampIconPos(startPos.x + dx, startPos.y + dy));
      }
    };
    const onUp = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      draggingRef.current = false;
      if (moved) {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        const clamped = clampIconPos(startPos.x + dx, startPos.y + dy);
        const snapped = snapIconPosToGrid(clamped.x, clamped.y);
        setPos(snapped);
        onDragEnd(snapped);
      } else {
        const now = Date.now();
        if (now - lastTapRef.current < 350) {
          onOpen();
          lastTapRef.current = 0;
        } else {
          lastTapRef.current = now;
          onSelect();
        }
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div
      data-desktop-icon
      onPointerDown={onPointerDown}
      onDoubleClick={onOpen}
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.35rem",
        width: "84px",
        padding: "0.6rem 0.4rem",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        borderRadius: "2px",
        touchAction: "none",
        userSelect: "none",
      }}
    >
      <div style={{ position: "relative" }}>
        {typeof icon === "string" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={icon} alt="" width={34} height={34} draggable={false} />
        ) : (
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "7px",
              background: tile ?? "linear-gradient(135deg, #cfcfcf 0%, #8a8a8a 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "inset 0 1px 1px rgba(255,255,255,0.6), inset 0 -2px 3px rgba(0,0,0,0.25), 0 2px 4px rgba(0,0,0,0.55)",
            }}
          >
            <FontAwesomeIcon icon={icon} color={iconColor} width={19} height={19} />
          </div>
        )}
        {selected && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: "-4px",
              background: "rgba(11,97,255,0.4)",
              border: "1px dotted rgba(255,255,255,0.7)",
              borderRadius: "3px",
            }}
          />
        )}
      </div>
      <span
        style={{
          fontFamily: WIN_FONT,
          fontWeight: 700,
          fontSize: "0.7rem",
          color: "#fff",
          textAlign: "center",
          padding: selected ? "0 3px" : "0",
          background: selected ? "#0b61ff" : "transparent",
          textShadow: selected
            ? "none"
            : "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000",
        }}
      >
        {label}
      </span>
    </div>
  );
}

type ResizeDir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const RESIZE_CURSORS: Record<ResizeDir, string> = {
  n: "ns-resize",
  s: "ns-resize",
  e: "ew-resize",
  w: "ew-resize",
  ne: "nesw-resize",
  sw: "nesw-resize",
  nw: "nwse-resize",
  se: "nwse-resize",
};

// Calcula el rect resultante de arrastrar el borde/esquina `dir`, siempre a
// partir del rect que tenía la ventana AL EMPEZAR el gesto (no del último
// valor intermedio) — así el resultado es estable y no se acumulan errores
// de redondeo entre eventos de puntero.
function computeResizedRect(start: WinRect, dir: ResizeDir, dx: number, dy: number): WinRect {
  let { x, y, width, height } = start;

  if (dir.includes("e")) {
    width = Math.min(Math.max(start.width + dx, MIN_WIDTH), window.innerWidth - start.x - 16);
  }
  if (dir.includes("w")) {
    const right = start.x + start.width;
    width = Math.min(Math.max(start.width - dx, MIN_WIDTH), right);
    x = right - width;
  }
  if (dir.includes("s")) {
    height = Math.min(
      Math.max(start.height + dy, MIN_HEIGHT),
      window.innerHeight - TASKBAR_HEIGHT - start.y - 8
    );
  }
  if (dir.includes("n")) {
    const bottom = start.y + start.height;
    height = Math.min(Math.max(start.height - dy, MIN_HEIGHT), bottom);
    y = bottom - height;
  }
  return { x, y, width, height };
}

function ResizeHandle({
  dir,
  rect,
  setRect,
  onCommit,
  onResizeStart,
  onResizeEnd,
  style,
}: {
  dir: ResizeDir;
  rect: WinRect;
  setRect: (updater: (r: WinRect) => WinRect) => void;
  onCommit: (r: WinRect) => void;
  onResizeStart: () => void;
  onResizeEnd: () => void;
  style: React.CSSProperties;
}) {
  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const start = rect;
    // Referencia local al último rect calculado — la leemos en onUp para
    // persistir. No llamamos onCommit() *dentro* del updater de setRect:
    // React puede invocar esos updaters durante su propio ciclo de
    // render/commit, y disparar ahí una actualización a otro store (Zustand)
    // es lo que causaba el warning "Cannot update a component while
    // rendering a different component".
    let latest = start;
    onResizeStart();

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const next = computeResizedRect(start, dir, dx, dy);
      latest = next;
      setRect(() => next);
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      onResizeEnd();
      // Persistimos el tamaño final (no en cada tick de movimiento, para no
      // escribir en sessionStorage decenas de veces por segundo).
      onCommit(latest);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div
      onPointerDown={onPointerDown}
      aria-hidden="true"
      style={{
        position: "absolute",
        touchAction: "none",
        cursor: RESIZE_CURSORS[dir],
        ...style,
      }}
    />
  );
}

function maximizedRect(): WinRect {
  return {
    x: -3,
    y: -3,
    width: window.innerWidth + 6,
    height: window.innerHeight - TASKBAR_HEIGHT + 3,
  };
}

function AppWindow({
  appId,
  cascadeIndex,
  zIndex,
  minimized,
  focused,
  onClose,
  onFocus,
  onMinimize,
  onShutdown,
  viewingImage,
  viewingImageDate,
  onOpenImage,
}: {
  appId: AppId;
  cascadeIndex: number;
  zIndex: number;
  minimized: boolean;
  focused: boolean;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  onShutdown: () => void;
  viewingImage: string | null;
  viewingImageDate: string | null;
  onOpenImage: (src: string, date: string) => void;
}) {
  const meta = APP_META[appId];
  const src = IFRAME_APPS[appId] ?? "";
  const savedRect = useMiniOSStore((s) => s.windowRects[appId]);
  const setWindowRect = useMiniOSStore((s) => s.setWindowRect);
  // Recordamos la última posición/tamaño de esta ventana (persistido, ver
  // src/store/miniOsStore.ts) — si nunca se abrió antes, cae a la cascada
  // inicial de siempre.
  const [rect, setRect] = useState<WinRect>(() => savedRect ?? initialRect(appId, cascadeIndex));
  const [maximized, setMaximized] = useState(false);
  const [preMaxRect, setPreMaxRect] = useState<WinRect | null>(null);
  const commitRect = (r: WinRect) => setWindowRect(appId, r);
  // Mientras se arrastra o redimensiona, tapamos el contenido con un overlay
  // transparente. Sin esto, un <iframe> (Paint) se queda con la captura del
  // mouse y cada resize le fuerza un reflow interno — el arrastre se sentía
  // "lagueado"/entrecortado en vez de seguir al mouse en tiempo real.
  const [interacting, setInteracting] = useState(false);

  // Si algo de afuera reacomoda esta ventana ya abierta (ej. al abrir el
  // visor de imágenes desde Fotos, que corre a Fotos al costado para que no
  // quede tapada del todo), seguimos ese cambio — pero no mientras el
  // usuario la está arrastrando/redimensionando o mientras está maximizada
  // (ahí la posición "real" es preMaxRect, no `rect`).
  useEffect(() => {
    if (!savedRect || interacting || maximized) return;
    setRect((prev) =>
      prev.x === savedRect.x &&
      prev.y === savedRect.y &&
      prev.width === savedRect.width &&
      prev.height === savedRect.height
        ? prev
        : savedRect
    );
  }, [savedRect, interacting, maximized]);

  const toggleMaximize = () => {
    if (maximized) {
      if (preMaxRect) {
        setRect(preMaxRect);
        setWindowRect(appId, preMaxRect);
      }
      setMaximized(false);
    } else {
      setPreMaxRect(rect);
      setRect(maximizedRect());
      setMaximized(true);
    }
  };

  const onTitleBarPointerDown = (e: React.PointerEvent) => {
    onFocus();
    if (maximized) return;
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = rect.x;
    const startPosY = rect.y;
    // Ver el comentario equivalente en ResizeHandle: evitamos llamar a
    // setWindowRect (Zustand) desde adentro del updater de setRect.
    let latest = rect;
    setInteracting(true);

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      setRect((r) => {
        const next = {
          ...r,
          x: Math.max(0, Math.min(startPosX + dx, Math.max(0, window.innerWidth - r.width))),
          y: Math.max(0, Math.min(startPosY + dy, window.innerHeight - TASKBAR_HEIGHT - r.height)),
        };
        latest = next;
        return next;
      });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      setInteracting(false);
      // Persistimos la posición final (no en cada tick de arrastre).
      setWindowRect(appId, latest);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <motion.div
      className={`mos-window ${focused ? "focus" : "mos-unfocused"} ${maximized ? "maximized" : ""}`}
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 16 }}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      onPointerDownCapture={onFocus}
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        zIndex,
        display: minimized ? "none" : "flex",
      }}
    >
      <div className={`mos-header-bg ${focused ? "focus" : "mos-unfocused"}`} />
      <div
        className="mos-header"
        onPointerDown={onTitleBarPointerDown}
        onDoubleClick={(e) => {
          if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
          toggleMaximize();
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={meta.iconSmall}
          alt=""
          width={14}
          height={14}
          draggable={false}
          style={{ marginLeft: "2px", marginRight: "5px", flexShrink: 0 }}
        />
        <span className="mos-header-title">{meta.label}</span>
        <div className={`mos-header-btns ${focused ? "" : "mos-unfocused"}`}>
          <button
            data-no-drag
            className="mos-header-btn mos-header-btn--minimize"
            aria-label="Minimizar"
            onClick={onMinimize}
          />
          <button
            data-no-drag
            className={`mos-header-btn ${
              maximized ? "mos-header-btn--maximized" : "mos-header-btn--maximize"
            }`}
            aria-label={maximized ? "Restaurar" : "Maximizar"}
            onClick={toggleMaximize}
          />
          <button
            data-no-drag
            className="mos-header-btn mos-header-btn--close"
            aria-label="Cerrar ventana"
            onClick={onClose}
          />
        </div>
      </div>
      <div
        className="mos-content"
        style={{
          padding: [
            "notepad",
            "my-computer",
            "minesweeper",
            "ie",
            "private-folder",
            "photos",
            "image-viewer",
          ].includes(appId)
            ? 0
            : "3px",
        }}
      >
        {appId === "notepad" ? (
          <Notepad onClose={onClose} />
        ) : appId === "my-computer" ? (
          <MyComputer onClose={onClose} onShutdown={onShutdown} />
        ) : appId === "minesweeper" ? (
          <Minesweeper />
        ) : appId === "ie" ? (
          <InternetExplorer />
        ) : appId === "private-folder" ? (
          <PrivateFolder />
        ) : appId === "photos" ? (
          <PhotosFolder onOpenImage={onOpenImage} />
        ) : appId === "image-viewer" ? (
          <ImageViewer src={viewingImage} date={viewingImageDate} />
        ) : (
          <iframe
            src={src}
            title={meta.label}
            style={{ width: "100%", height: "100%", border: "1px solid #16408f", background: "#fff" }}
          />
        )}
        {interacting && (
          <div
            aria-hidden="true"
            style={{ position: "absolute", inset: 0, zIndex: 50, cursor: "inherit" }}
          />
        )}
      </div>
      {!maximized && (
        <>
          <ResizeHandle
            dir="n"
            rect={rect}
            setRect={setRect}
            onCommit={commitRect}
            onResizeStart={() => setInteracting(true)}
            onResizeEnd={() => setInteracting(false)}
            style={{ top: 0, left: 10, right: 10, height: 6 }}
          />
          <ResizeHandle
            dir="s"
            rect={rect}
            setRect={setRect}
            onCommit={commitRect}
            onResizeStart={() => setInteracting(true)}
            onResizeEnd={() => setInteracting(false)}
            style={{ bottom: 0, left: 10, right: 10, height: 6 }}
          />
          <ResizeHandle
            dir="w"
            rect={rect}
            setRect={setRect}
            onCommit={commitRect}
            onResizeStart={() => setInteracting(true)}
            onResizeEnd={() => setInteracting(false)}
            style={{ left: 0, top: 10, bottom: 10, width: 6 }}
          />
          <ResizeHandle
            dir="e"
            rect={rect}
            setRect={setRect}
            onCommit={commitRect}
            onResizeStart={() => setInteracting(true)}
            onResizeEnd={() => setInteracting(false)}
            style={{ right: 0, top: 10, bottom: 10, width: 6 }}
          />
          <ResizeHandle
            dir="nw"
            rect={rect}
            setRect={setRect}
            onCommit={commitRect}
            onResizeStart={() => setInteracting(true)}
            onResizeEnd={() => setInteracting(false)}
            style={{ top: 0, left: 0, width: 10, height: 10 }}
          />
          <ResizeHandle
            dir="ne"
            rect={rect}
            setRect={setRect}
            onCommit={commitRect}
            onResizeStart={() => setInteracting(true)}
            onResizeEnd={() => setInteracting(false)}
            style={{ top: 0, right: 0, width: 10, height: 10 }}
          />
          <ResizeHandle
            dir="sw"
            rect={rect}
            setRect={setRect}
            onCommit={commitRect}
            onResizeStart={() => setInteracting(true)}
            onResizeEnd={() => setInteracting(false)}
            style={{ bottom: 0, left: 0, width: 10, height: 10 }}
          />
          <ResizeHandle
            dir="se"
            rect={rect}
            setRect={setRect}
            onCommit={commitRect}
            onResizeStart={() => setInteracting(true)}
            onResizeEnd={() => setInteracting(false)}
            style={{
              bottom: 0,
              right: 0,
              width: 16,
              height: 16,
              background:
                "repeating-linear-gradient(135deg, transparent 0 2px, #808080 2px 3px)",
              WebkitMaskImage:
                "linear-gradient(to top left, black 0%, black 45%, transparent 46%)",
              maskImage:
                "linear-gradient(to top left, black 0%, black 45%, transparent 46%)",
            }}
          />
        </>
      )}
    </motion.div>
  );
}

// Webamp es una librería de terceros compleja que manipula el DOM por su
// cuenta; esto contiene cualquier error inesperado suyo a solo esta ventana
// en vez de tumbar el resto del mini-OS.
class WinampErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: unknown) {
    console.error("[Winamp] render error", err);
    this.props.onError();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

interface SpotifyApiTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumImage: string;
  previewUrl: string | null;
  songUrl: string;
  durationMs: number;
}

// Trae las últimas 10 canciones reproducidas en mi Spotify real (misma API
// que ya usa el widget de la sección Hero).
async function fetchSpotifyRecentTracks(): Promise<SpotifyApiTrack[]> {
  try {
    const res = await fetch("/api/spotify/recent");
    if (!res.ok) return [];
    const data = (await res.json()) as { tracks?: SpotifyApiTrack[] };
    return data.tracks ?? [];
  } catch (err) {
    console.error("[Winamp] failed to fetch Spotify recent tracks", err);
    return [];
  }
}

// Todas las pistas van a la playlist real de Webamp con su nombre/artista
// verdadero, tengan o no preview reproducible: así la lista siempre muestra
// mis últimas 10 de Spotify. Si Spotify dio un preview_url (~30s) se usa esa
// URL de audio real; si no (algo común desde nov. 2024 para buena parte del
// catálogo, según la app), queda sin audio — aparece en la lista igual, pero
// no suena al reproducirla.
function toWebampTracks(tracks: SpotifyApiTrack[]) {
  return tracks.map((t) => ({
    url: t.previewUrl ?? "",
    duration: 30,
    metaData: { title: t.title, artist: t.artist, album: t.album },
  }));
}

function WinampHost({
  zIndex,
  minimized,
  onClose,
  onMinimize,
  onFocus,
}: {
  zIndex: number;
  minimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const webampRef = useRef<WebampType | null>(null);
  const [loadError, setLoadError] = useState(false);
  // Cuando el usuario cierra Winamp desde su propia UI (el botón "X" de la
  // skin), Webamp llama a su close() interno *antes* de avisarnos por
  // onClose — la instancia queda en su propio estado "cerrado", separado de
  // que nuestro contenedor esté oculto o no. Por eso alcanzar con volver a
  // mostrar el contenedor (display) no la reabre: hay que llamar a su
  // reopen() explícitamente.
  const wasClosedRef = useRef(false);
  const prevMinimizedRef = useRef(minimized);
  // Preview URLs que ya están cargadas en la playlist — evita agregar
  // duplicados cuando el refresco periódico (ver más abajo) vuelve a traer
  // canciones que ya conocíamos.
  const knownPreviewUrlsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;
    let cancelled = false;
    Promise.all([import("webamp"), fetchSpotifyRecentTracks()])
      .then(([{ default: Webamp }, recentTracks]) => {
        if (cancelled || !target) return;
        // Si logré traer mi historial reciente de Spotify, esas 10 abren la
        // lista (con o sin preview reproducible); si la API falla o no hay
        // historial, caemos a las pistas de muestra de siempre.
        for (const t of recentTracks) {
          if (t.previewUrl) knownPreviewUrlsRef.current.add(t.previewUrl);
        }
        const spotifyTracks = toWebampTracks(recentTracks);
        const webamp = new Webamp({
          initialTracks: spotifyTracks.length > 0 ? spotifyTracks : WEBAMP_TRACKS,
        });
        webampRef.current = webamp;
        // Webamp centra su ventana inicial usando window.scrollY y el
        // tamaño real del contenedor en el momento de montar. Si Winamp ya
        // estaba abierto de una sesión anterior (persistencia), su efecto
        // de montaje puede correr ANTES que el efecto del componente padre
        // que resetea el scroll a 0 (React monta efectos de hijos antes que
        // los del padre) — eso la hacía aparecer fuera de la pantalla
        // "a veces". Forzamos scroll 0 acá también y esperamos a que el
        // layout esté asentado (doble rAF) antes de medir/renderizar, así
        // no dependemos del orden de otros efectos.
        window.scrollTo(0, 0);
        return new Promise<void>((resolve, reject) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (cancelled || !target) {
                resolve();
                return;
              }
              webamp.renderInto(target).then(resolve, reject);
            });
          });
        });
      })
      .catch((err) => {
        console.error("[Winamp] failed to load", err);
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
      webampRef.current?.dispose();
      webampRef.current = null;
    };
  }, []);

  // Refresca la cola con canciones nuevas de Spotify cada 30s — mismo
  // intervalo que usa la card "Now Playing" de la sección Hero (ver
  // SpotifyWidget.tsx). No interrumpe lo que esté sonando: solo agrega al
  // final las que todavía no estaban en la lista.
  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      const recentTracks = await fetchSpotifyRecentTracks();
      if (cancelled || !webampRef.current) return;
      const newOnes = recentTracks.filter(
        (t) => t.previewUrl && !knownPreviewUrlsRef.current.has(t.previewUrl)
      );
      if (newOnes.length === 0) return;
      for (const t of newOnes) knownPreviewUrlsRef.current.add(t.previewUrl!);
      webampRef.current.appendTracks(toWebampTracks(newOnes));
    };
    const id = setInterval(poll, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Cablear los callbacks en cada render para que siempre usen la versión
  // más reciente de onClose/onMinimize (evita closures viejas del efecto).
  useEffect(() => {
    if (!webampRef.current) return;
    const unsubClose = webampRef.current.onClose(() => {
      wasClosedRef.current = true;
      onClose();
    });
    const unsubMinimize = webampRef.current.onMinimize(onMinimize);
    return () => {
      unsubClose();
      unsubMinimize();
    };
  });

  // Al volver a mostrar el contenedor después de un cierre real (no un
  // simple minimizado), reabrimos la instancia de Webamp con reopen().
  useEffect(() => {
    const wasHidden = prevMinimizedRef.current;
    prevMinimizedRef.current = minimized;
    if (wasHidden && !minimized && wasClosedRef.current && webampRef.current) {
      webampRef.current.reopen();
      wasClosedRef.current = false;
    }
  }, [minimized]);

  return (
    <>
      <div
        ref={containerRef}
        className="mos-winamp-host"
        onPointerDownCapture={onFocus}
        style={{
          position: "fixed",
          inset: 0,
          zIndex,
          // OJO: no usar display:none acá. Webamp mide el tamaño real del
          // contenedor (getBoundingClientRect) para centrarse la primera vez
          // que hace renderInto — si el contenedor está oculto con
          // display:none en ese momento (por ejemplo, Winamp ya estaba
          // "montado" de una sesión anterior pero todavía no se abrió en
          // esta), mide 0x0 y termina centrándose en una posición absurda
          // ("se va lejos"). Con visibility:hidden el layout se mantiene
          // (sigue ocupando toda la pantalla) pero no se ve ni se puede
          // interactuar, así que Webamp siempre mide el viewport real.
          visibility: minimized ? "hidden" : "visible",
          // El contenedor en sí no debe capturar clicks — solo ocupa toda
          // la pantalla porque Webamp necesita ese espacio de coordenadas
          // para centrarse/arrastrarse. Sin esto, el área "vacía" (fuera de
          // la skin de Winamp) tapaba clicks a todo lo que estuviera detrás,
          // incluyendo el resto de ventanas del SO. La regla
          // ".mos-winamp-host > *" en MINI_OS_CSS reactiva los clicks solo
          // para la UI real de Webamp.
          pointerEvents: "none",
        }}
      />
      {loadError && !minimized && (
        <div
          className="mos-window focus"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: "320px",
            zIndex,
          }}
        >
          <div className="mos-header-bg focus" />
          <div className="mos-header">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={APP_META.winamp.icon}
              alt=""
              width={14}
              height={14}
              draggable={false}
              style={{ marginLeft: "2px", marginRight: "5px" }}
            />
            <span className="mos-header-title">Winamp</span>
            <div className="mos-header-btns">
              <button
                data-no-drag
                className="mos-header-btn mos-header-btn--close"
                aria-label="Cerrar ventana"
                onClick={onClose}
              />
            </div>
          </div>
          <div className="mos-content" style={{ padding: "1.5rem 1rem" }}>
            <p style={{ fontFamily: WIN_FONT, fontSize: "0.8rem", margin: 0 }}>
              No se pudo cargar Winamp. Prueba de nuevo más tarde.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// Ítem de una columna del menú de inicio: ícono a la izquierda + texto (con
// subtítulo opcional), estructura calcada de FooterMenu.js del repo de
// referencia (menu__item / menu__item__img / menu__item__texts).
function StartMenuItem({
  icon,
  iconColor,
  tile,
  text,
  subtext,
  bold,
  compact,
  onClick,
  onMouseEnter,
  onMouseLeave,
  hasFlyout,
  children,
}: {
  icon: string | IconDefinition;
  iconColor?: string;
  tile?: string;
  text: string;
  subtext?: string;
  bold?: boolean;
  compact?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  hasFlyout?: boolean;
  children?: ReactNode;
}) {
  const size = compact ? 20 : 26;
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="mos-start-item"
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "1px",
        height: compact ? "26px" : "34px",
        marginBottom: "3px",
        cursor: "pointer",
        borderRadius: "2px",
      }}
    >
      {typeof icon === "string" ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={icon} alt="" width={size} height={size} draggable={false} style={{ flexShrink: 0 }} />
      ) : (
        <div
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: "5px",
            background: tile ?? "linear-gradient(135deg, #cfcfcf 0%, #8a8a8a 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <FontAwesomeIcon icon={icon} color={iconColor ?? "#fff"} width={compact ? 11 : 15} />
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: bold ? 700 : 400,
            color: "inherit",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </span>
        {subtext && (
          <span style={{ fontSize: "0.62rem", color: "inherit", opacity: 0.6 }}>{subtext}</span>
        )}
      </div>
      {hasFlyout && (
        <FontAwesomeIcon
          icon={faChevronRight}
          width={8}
          style={{ position: "absolute", right: "6px", top: "50%", transform: "translateY(-50%)" }}
        />
      )}
      {children}
    </div>
  );
}

function StartMenu({
  recentApps,
  onOpenApp,
  onGoToSection,
  onShowFakeError,
  onSuspend,
  onShutdown,
}: {
  recentApps: AppId[];
  onOpenApp: (key: AppId) => void;
  onGoToSection: (sectionId: string) => void;
  onShowFakeError: () => void;
  onSuspend: () => void;
  onShutdown: () => void;
}) {
  const [hovering, setHovering] = useState<"" | "recent" | "trending" | "programs">("");

  return (
    <motion.div
      data-start-menu
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.15 }}
      style={{
        position: "absolute",
        left: "0.4rem",
        bottom: `${TASKBAR_HEIGHT + 4}px`,
        width: "384px",
        background: "#fff",
        border: "1px solid #0a3aa8",
        borderRadius: "8px 8px 0 0",
        boxShadow: "3px 3px 10px rgba(0,0,0,0.5)",
        zIndex: 30,
        fontFamily: WIN_FONT,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        .mos-start-item:hover { background-color: #2f71cd; color: #fff; }
        .mos-start-item:hover span { color: #fff !important; }
      `}</style>

      {/* Banner tipo XP, con "avatar" del usuario */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 0.6rem",
          borderRadius: "8px 8px 0 0",
          overflow: "hidden",
          background:
            "linear-gradient(to bottom,#1868ce 0%,#0e60cb 12%,#0e60cb 20%,#1164cf 32%,#1667cf 33%,#1b6cd3 47%,#1e70d9 54%,#2476dc 60%,#297ae0 65%,#3482e3 77%,#3786e5 79%,#428ee9 90%,#4791eb 100%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${ICONS}/user.png`}
          alt=""
          width={38}
          height={38}
          draggable={false}
          style={{ borderRadius: "3px", border: "2px solid rgba(222,222,222,0.8)" }}
        />
        <span
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: "0.85rem",
            textShadow: "1px 1px rgba(0,0,0,0.7)",
          }}
        >
          EdDev
        </span>
      </header>

      {/* Cuerpo de dos columnas */}
      <section style={{ display: "flex" }}>
        {/* Columna izquierda: apps "fijadas" */}
        <div
          style={{
            background: "#fff",
            padding: "0.5rem 0.4rem 0",
            width: "192px",
            color: "#000",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <StartMenuItem
            icon={APP_META.ie.icon}
            text="Internet"
            subtext="Internet Explorer"
            bold
            onClick={() => onOpenApp("ie")}
          />
          <StartMenuItem
            icon={`${ICONS}/mail-32.png`}
            text="Contacto"
            subtext="Enviame un mensaje"
            bold
            onClick={() => onGoToSection("contact")}
          />
          <div style={{ height: "8px", borderTop: "1px solid rgba(0,0,0,0.15)", margin: "4px 0" }} />
          <StartMenuItem
            icon={APP_META.minesweeper.icon}
            text="Minesweeper"
            onClick={() => onOpenApp("minesweeper")}
          />
          <StartMenuItem
            icon={APP_META.notepad.icon}
            text="Notepad"
            onClick={() => onOpenApp("notepad")}
          />
          <StartMenuItem
            icon={APP_META.winamp.icon}
            text="Winamp"
            onClick={() => onOpenApp("winamp")}
          />
          <StartMenuItem
            icon={APP_META.paint.icon}
            text="Paint"
            onClick={() => onOpenApp("paint")}
          />
          <StartMenuItem
            icon={APP_META["my-computer"].icon}
            text="My Computer"
            onClick={() => onOpenApp("my-computer")}
          />
          <div style={{ height: "8px", borderTop: "1px solid rgba(0,0,0,0.15)", margin: "4px 0" }} />
          <StartMenuItem
            icon={faArrowTrendUp}
            iconColor="#fff"
            tile="linear-gradient(135deg, #ff8a75 0%, #b3251b 100%)"
            text="Trending"
            bold
            hasFlyout
            compact
            onMouseEnter={() => setHovering("trending")}
            onMouseLeave={() => setHovering("")}
          >
            {hovering === "trending" && (
              <div
                className="sub_menu"
                style={{
                  position: "absolute",
                  left: "100%",
                  bottom: 0,
                  width: "220px",
                  background: "#fff",
                  border: "1px solid #000",
                  boxShadow: "2px 2px 6px rgba(0,0,0,0.4)",
                  padding: "0.5rem",
                  zIndex: 40,
                }}
              >
                {TRENDING_ITEMS.map((item) => (
                  <div
                    key={item}
                    style={{
                      fontSize: "0.68rem",
                      color: "#000",
                      padding: "0.25rem 0.2rem",
                      lineHeight: 1.3,
                    }}
                  >
                    • {item}
                  </div>
                ))}
              </div>
            )}
          </StartMenuItem>

          <div style={{ flex: 1 }} />
          <div style={{ height: "8px", borderTop: "1px solid rgba(0,0,0,0.15)", margin: "4px 0" }} />
          <StartMenuItem
            icon={faListUl}
            iconColor="#fff"
            tile="linear-gradient(135deg, #cfcfcf 0%, #8a8a8a 100%)"
            text="All Programs"
            bold
            hasFlyout
            onMouseEnter={() => setHovering("programs")}
            onMouseLeave={() => setHovering("")}
          >
            {hovering === "programs" && (
              <div
                className="sub_menu"
                style={{
                  position: "absolute",
                  left: "100%",
                  bottom: 0,
                  width: "170px",
                  background: "#fff",
                  border: "1px solid #000",
                  boxShadow: "2px 2px 6px rgba(0,0,0,0.4)",
                  padding: "0.35rem",
                  zIndex: 40,
                }}
              >
                {ALL_PROGRAMS.map((key) => (
                  <div
                    key={key}
                    onClick={() => onOpenApp(key)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      fontSize: "0.68rem",
                      color: "#000",
                      padding: "0.3rem",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#2f71cd")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={APP_META[key].iconSmall} alt="" width={16} height={16} draggable={false} />
                    {APP_META[key].label}
                  </div>
                ))}
              </div>
            )}
          </StartMenuItem>
        </div>

        {/* Columna derecha: documentos / accesos */}
        <div
          style={{
            background: "#cbe3ff",
            borderLeft: "1px solid rgba(58,58,255,0.37)",
            padding: "0.5rem 0.4rem",
            width: "192px",
            color: "#00136b",
          }}
        >
          <StartMenuItem
            icon={`${ICONS}/recent-documents.png`}
            text="Recientes"
            compact
            hasFlyout
            onMouseEnter={() => setHovering("recent")}
            onMouseLeave={() => setHovering("")}
          >
            {hovering === "recent" && (
              <div
                className="sub_menu"
                style={{
                  position: "absolute",
                  left: "100%",
                  bottom: 0,
                  width: "180px",
                  background: "#fff",
                  border: "1px solid #000",
                  boxShadow: "2px 2px 6px rgba(0,0,0,0.4)",
                  padding: "0.35rem",
                  zIndex: 40,
                  color: "#000",
                }}
              >
                {recentApps.length === 0 ? (
                  <div style={{ fontSize: "0.68rem", color: "#555", padding: "0.25rem" }}>
                    (Vacío)
                  </div>
                ) : (
                  recentApps.map((key) => (
                    <div
                      key={key}
                      onClick={() => onOpenApp(key)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        fontSize: "0.68rem",
                        padding: "0.25rem",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#2f71cd")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={APP_META[key].iconSmall} alt="" width={13} height={13} draggable={false} />
                      {APP_META[key].label}
                    </div>
                  ))
                )}
              </div>
            )}
          </StartMenuItem>
          <div style={{ height: "7px", borderTop: "1px solid rgba(0,0,0,0.15)", margin: "4px 0" }} />
          <StartMenuItem
            icon={`${ICONS}/recycle-bin2-32.png`}
            text="Recycle Bin"
            compact
            onClick={onShowFakeError}
          />
        </div>
      </section>

      {/* Apagar / Suspender */}
      <footer
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.3rem",
          padding: "0.4rem",
          background:
            "linear-gradient(to bottom,#4282d6 0%,#3b85e0 3%,#418ae3 5%,#418ae3 17%,#3c87e2 21%,#3786e4 26%,#3482e3 29%,#2e7ee1 39%,#2374df 49%,#2072db 57%,#196edb 62%,#176bd8 72%,#1468d5 75%,#1165d2 83%,#0f61cb 88%)",
        }}
      >
        <button
          onClick={onSuspend}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.25rem 0.5rem",
            background: "transparent",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
            fontSize: "0.72rem",
            fontFamily: WIN_FONT,
            color: "#fff",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(60,80,210,0.5)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ICONS}/lock.png`} alt="" width={20} height={20} draggable={false} style={{ borderRadius: "3px" }} />
          Suspender
        </button>
        <button
          onClick={onShutdown}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            padding: "0.25rem 0.5rem",
            background: "transparent",
            border: "none",
            borderRadius: "3px",
            cursor: "pointer",
            fontSize: "0.72rem",
            fontFamily: WIN_FONT,
            color: "#fff",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(60,80,210,0.5)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${ICONS}/shutdown.png`} alt="" width={20} height={20} draggable={false} style={{ borderRadius: "3px" }} />
          Apagar
        </button>
      </footer>
    </motion.div>
  );
}

function FakeErrorDialog({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
      className="mos-window focus"
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: "340px",
        zIndex: 500,
      }}
    >
      <div className="mos-header-bg focus" />
      <div className="mos-header">
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          color="#fff"
          width={13}
          style={{ marginLeft: "2px", marginRight: "5px" }}
        />
        <span className="mos-header-title">Recycle Bin</span>
        <div className="mos-header-btns">
          <button
            data-no-drag
            className="mos-header-btn mos-header-btn--close"
            aria-label="Cerrar"
            onClick={onClose}
          />
        </div>
      </div>
      <div
        className="mos-content"
        style={{ display: "flex", gap: "0.8rem", padding: "1.25rem 1rem" }}
      >
        <FontAwesomeIcon icon={faTriangleExclamation} color="#e6b800" width={38} />
        <div style={{ fontFamily: WIN_FONT, fontSize: "0.75rem" }}>
          <p style={{ margin: "0 0 0.75rem" }}>
            No se puede vaciar la Papelera de reciclaje: contiene los bugs de
            producción de 2024. Eliminarlos podría causar una crisis
            existencial.
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={onClose}
              style={{
                padding: "0.3rem 1.2rem",
                background: "linear-gradient(180deg, #fff 0%, #e3e3e3 50%, #c6c6c6 100%)",
                border: "1px solid #8a8a8a",
                borderRadius: "3px",
                fontFamily: WIN_FONT,
                fontSize: "0.75rem",
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function BootScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1000,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.75rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${ICONS}/start.png`} alt="" width={44} height={44} draggable={false} />
        <span
          style={{
            fontFamily: WIN_FONT,
            fontSize: "1.9rem",
            fontWeight: 700,
            fontStyle: "italic",
            color: "#fff",
            textShadow: "0 1px 2px rgba(0,0,0,0.6)",
          }}
        >
          Bienvenido
        </span>
      </div>
      <div
        style={{
          width: "180px",
          height: "12px",
          border: "1px solid #3a5f9e",
          borderRadius: "2px",
          overflow: "hidden",
          background: "#000",
          padding: "2px",
        }}
      >
        <motion.div
          style={{
            height: "100%",
            width: "60px",
            borderRadius: "1px",
            background: "linear-gradient(90deg, #1c5faa, #7ec8f2, #1c5faa)",
          }}
          animate={{ x: ["-60px", "180px"] }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}

function SuspendedOverlay({ onWake }: { onWake: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onWake}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 999,
        background: "#000",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <video
        src="/videos/os/suspend.mp4"
        autoPlay
        loop
        muted
        playsInline
        onEnded={(e) => {
          // Refuerzo manual: algunos navegadores no repiten confiablemente
          // solo con el atributo `loop` nativo.
          const v = e.currentTarget;
          v.currentTime = 0;
          v.play().catch(() => {});
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
        }}
      >
        <motion.div
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <FontAwesomeIcon icon={faMoon} width={28} color="#aab8ff" />
        </motion.div>
        <span
          style={{
            fontFamily: WIN_FONT,
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "0.04em",
            textShadow: "0 1px 3px rgba(0,0,0,0.7)",
          }}
        >
          Suspendido — tocá para despertar
        </span>
      </div>
    </motion.div>
  );
}

/**
 * Easter egg de la pantalla del escritorio: un mini "sistema operativo" a
 * pantalla completa, con el look Windows XP "Luna" (gradientes/valores
 * calcados de github.com/ShizukuIchi/winXP). Soporta varias ventanas
 * abiertas a la vez, cada una movible y redimensionable. Por ahora solo
 * contiene el CV, pensado para sumar más "apps" a futuro.
 */
function useIsPortrait() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(orientation: portrait)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(orientation: portrait)").matches,
    () => false,
  );
}

export default function MiniOS({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const isMobile = useIsMobile();
  const isPortrait = useIsPortrait();
  // Estado persistido (sessionStorage, vía Zustand): qué apps quedaron
  // abiertas/minimizadas, recientes, si Winamp ya se montó alguna vez y si
  // ya se mostró la bienvenida — todo esto sobrevive a cerrar/abrir el OS
  // dentro de la misma visita a la página. Ver src/store/miniOsStore.ts.
  const openWindows = useMiniOSStore((s) => s.openWindows);
  const minimizedApps = useMiniOSStore((s) => s.minimizedApps);
  const recentApps = useMiniOSStore((s) => s.recentApps);
  const winampMounted = useMiniOSStore((s) => s.winampMounted);
  const storeOpenApp = useMiniOSStore((s) => s.openApp);
  const closeApp = useMiniOSStore((s) => s.closeApp);
  const focusApp = useMiniOSStore((s) => s.focusApp);
  const minimizeApp = useMiniOSStore((s) => s.minimizeApp);
  const markBootScreenShown = useMiniOSStore((s) => s.markBootScreenShown);
  const desktopIconPositions = useMiniOSStore((s) => s.desktopIconPositions);
  const windowRects = useMiniOSStore((s) => s.windowRects);
  const setWindowRect = useMiniOSStore((s) => s.setWindowRect);
  const setDesktopIconPosition = useMiniOSStore((s) => s.setDesktopIconPosition);

  // Estado puramente de esta sesión de ventana abierta — no tiene sentido
  // persistirlo: arranca "limpio" cada vez que se abre el OS.
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [suspended, setSuspended] = useState(false);
  const [fakeErrorOpen, setFakeErrorOpen] = useState(false);
  const [selectedIcons, setSelectedIcons] = useState<Set<DesktopIconId>>(new Set());
  const [booting, setBooting] = useState(false);
  const [messengerToastOpen, setMessengerToastOpen] = useState(false);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [viewingImageDate, setViewingImageDate] = useState<string | null>(null);
  // Selección "de goma" (rubber-band): arrastrar en el fondo vacío dibuja un
  // rectángulo y selecciona todos los íconos que toque, como en un
  // escritorio real.
  const [marquee, setMarquee] = useState<{ x: number; y: number; width: number; height: number } | null>(
    null
  );
  const desktopRef = useRef<HTMLDivElement>(null);
  const time = useClock();
  const isOnline = useOnlineStatus();
  const [showNetworkInfo, setShowNetworkInfo] = useState(false);
  const networkInfo = useNetworkInfo(isOnline && showNetworkInfo);

  const showFakeError = () => {
    setFakeErrorOpen(true);
    new Audio("/sounds/os/error.wav").play().catch(() => {});
  };

  useEffect(() => {
    if (!open) {
      setStartMenuOpen(false);
      setSuspended(false);
      setSelectedIcons(new Set());
      setBooting(false);
    }
  }, [open]);

  // Pantalla de bienvenida: solo se muestra la primera vez que se abre el
  // mini-OS en esta visita a la página. Las veces siguientes solo suena el
  // sonido de inicio.
  // useLayoutEffect (no useEffect): esto decide `booting` ANTES de que el
  // navegador pinte — con useEffect alcanzábamos a ver un frame del
  // escritorio real (sin booting) antes de que la pantalla de bienvenida
  // apareciera encima.
  useLayoutEffect(() => {
    if (!open) return;
    const startupAudio = new Audio("/sounds/os/startup.mp3");
    startupAudio.volume = 0.35;
    startupAudio.play().catch(() => {});
    // Leemos el flag directo del store (no como dependencia reactiva): lo
    // cambiamos DENTRO de este mismo efecto (markBootScreenShown), y si
    // fuera una dependencia, ese cambio re-dispara el efecto y su cleanup
    // cancela los timers de acá abajo casi al instante.
    if (useMiniOSStore.getState().hasShownBootScreen) {
      setBooting(false);
      return;
    }
    markBootScreenShown();
    setBooting(true);
    const bootId = setTimeout(() => setBooting(false), 2800);
    // Notificación estilo Windows Messenger, solo la primera vez que se abre
    // el mini-OS en esta visita — aparece un momento después de que termina
    // la pantalla de bienvenida.
    const toastId = setTimeout(() => {
      setMessengerToastOpen(true);
      playNotificationChime();
    }, 3400);
    return () => {
      clearTimeout(bootId);
      clearTimeout(toastId);
    };
  }, [open, markBootScreenShown]);

  useEffect(() => {
    if (!messengerToastOpen) return;
    const id = setTimeout(() => setMessengerToastOpen(false), 8000);
    return () => clearTimeout(id);
  }, [messengerToastOpen]);

  // Suspender automáticamente tras 30s sin actividad (mouse/teclado/touch),
  // igual que hace un sistema operativo real.
  useEffect(() => {
    if (!open || suspended || booting) return;
    const INACTIVITY_MS = 30_000;
    let timeoutId: ReturnType<typeof setTimeout>;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setSuspended(true), INACTIVITY_MS);
    };
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "wheel"] as const;
    events.forEach((eventName) => window.addEventListener(eventName, resetTimer));
    resetTimer();
    return () => {
      clearTimeout(timeoutId);
      events.forEach((eventName) => window.removeEventListener(eventName, resetTimer));
    };
  }, [open, suspended, booting]);

  // Congelar el scroll de la página de fondo mientras el OS está abierto.
  // Necesario además de estético: Webamp centra su ventana usando
  // window.scrollY, y como nuestro overlay es position:fixed (su propio
  // containing block, ignora el scroll real de la página), un scrollY alto
  // hace que la calcule muy por debajo del viewport visible.
  useEffect(() => {
    if (!open) return;
    const savedScrollY = window.scrollY;
    const savedBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("mini-os-open");
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = savedBodyOverflow;
      document.body.classList.remove("mini-os-open");
      window.scrollTo(0, savedScrollY);
    };
  }, [open]);

  // Wrapper local: además de la acción del store, cierra el menú Inicio
  // (eso sí es puramente de esta ventana, no pertenece al estado persistido).
  const openApp = (key: AppId) => {
    storeOpenApp(key);
    setStartMenuOpen(false);
  };

  const openImage = (src: string, date: string) => {
    setViewingImage(src);
    setViewingImageDate(date);
    // La primera vez que se abre el visor, lo acomodamos al lado de Fotos en
    // vez de dejar que caiga centrado de siempre — si no, ambas ventanas
    // (de tamaño similar) quedan casi exactamente apiladas y no hay forma de
    // volver a hacer click en otra foto sin mover/cerrar el visor primero.
    // Si hay lugar en la pantalla, corremos también a Fotos hacia un
    // costado para que las dos queden completamente lado a lado, sin
    // superponerse. Las veces siguientes esto no se repite: reutiliza donde
    // haya quedado el visor.
    if (!openWindows.includes("image-viewer")) {
      const photosRect = windowRects.photos ?? initialRect("photos", openWindows.indexOf("photos"));
      const size = APP_DEFAULT_SIZE["image-viewer"];
      const width = Math.min(size.width, window.innerWidth * 0.92);
      const height = Math.min(size.height, window.innerHeight * 0.88);
      const margin = 16;
      const y = Math.max(
        margin,
        Math.min(window.innerHeight - TASKBAR_HEIGHT - height - margin, photosRect.y)
      );

      if (photosRect.width + width + margin * 3 <= window.innerWidth) {
        // Entran las dos sin superponerse: la que esté más cerca del borde
        // se pega a ese borde, la otra se pega al opuesto.
        const photosOnLeft = photosRect.x <= window.innerWidth - photosRect.x - photosRect.width;
        const newPhotosX = photosOnLeft ? margin : window.innerWidth - photosRect.width - margin;
        const x = photosOnLeft
          ? newPhotosX + photosRect.width + margin
          : newPhotosX - width - margin;
        if (newPhotosX !== photosRect.x) {
          setWindowRect("photos", { ...photosRect, x: newPhotosX });
        }
        setWindowRect("image-viewer", { x, y, width, height });
      } else {
        // No entran las dos completas sin superponerse (pantalla angosta):
        // al menos la mandamos lo más lejos posible del lado donde está
        // Fotos, para tapar la menor porción posible.
        const x =
          photosRect.x < window.innerWidth / 2
            ? Math.min(window.innerWidth - width - margin, photosRect.x + photosRect.width + margin)
            : Math.max(margin, photosRect.x - width - margin);
        setWindowRect("image-viewer", { x, y, width, height });
      }
    }
    openApp("image-viewer");
  };

  // Selección "de goma": arrastrar en el fondo vacío del escritorio dibuja
  // un rectángulo y selecciona los íconos que toque (posición guardada o,
  // si no la movieron, la posición por defecto de esa columna/fila).
  const onDesktopPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return; // click en un ícono, no en el fondo
    const container = desktopRef.current;
    if (!container) return;
    const bounds = container.getBoundingClientRect();
    const startX = e.clientX - bounds.left;
    const startY = e.clientY - bounds.top;
    let didDrag = false;

    const iconRects = DESKTOP_ICON_ORDER.map((iconId, index) => {
      const pos = desktopIconPositions[iconId] ?? getDefaultIconPos(index);
      return { iconId, x: pos.x, y: pos.y, width: 84, height: 90 };
    });

    const onMove = (ev: PointerEvent) => {
      const curX = ev.clientX - bounds.left;
      const curY = ev.clientY - bounds.top;
      if (Math.abs(curX - startX) > 3 || Math.abs(curY - startY) > 3) didDrag = true;
      if (!didDrag) return;
      const rect = {
        x: Math.min(startX, curX),
        y: Math.min(startY, curY),
        width: Math.abs(curX - startX),
        height: Math.abs(curY - startY),
      };
      setMarquee(rect);
      const hit = iconRects.filter(
        (r) =>
          rect.x < r.x + r.width &&
          rect.x + rect.width > r.x &&
          rect.y < r.y + r.height &&
          rect.y + rect.height > r.y
      );
      setSelectedIcons(new Set(hit.map((r) => r.iconId)));
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      setMarquee(null);
      if (!didDrag) setSelectedIcons(new Set());
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const taskbarClick = (key: AppId) => {
    const isTop = openWindows[openWindows.length - 1] === key;
    if (isTop && !minimizedApps.includes(key)) {
      minimizeApp(key);
    } else {
      focusApp(key);
    }
  };

  // Nota: Escape ya no cierra ventanas/menú/el SO — solo se usa para
  // despertar de "Suspender" (cualquier tecla lo hace, no solo Escape).
  useEffect(() => {
    if (!open || !suspended) return;
    const onKeyDown = () => setSuspended(false);
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, suspended]);

  // Mobile en portrait: pedir que roten el dispositivo
  if (isMobile && isPortrait && open) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#0a0a14",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
          }}
        >
          <motion.div
            animate={{ rotate: [0, 90, 90, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
            style={{ fontSize: "3.5rem" }}
          >
            📱
          </motion.div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "#f0f0f0", textAlign: "center", padding: "0 2rem" }}>
            Rotate your device to landscape to open the OS
          </p>
          <button
            onClick={onClose}
            style={{
              marginTop: "0.5rem",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "6px",
              color: "rgba(255,255,255,0.5)",
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              padding: "0.4rem 1rem",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          // Lenis (smooth-scroll global del resto del sitio, ver
          // SmoothScrollProvider.tsx) intercepta la rueda del mouse en toda
          // la página para animar su propio scroll suave — sin este atributo,
          // también se comía los eventos de rueda adentro del mini-OS,
          // rompiendo el scroll nativo de todas sus ventanas (Fotos, My
          // Computer, IE, etc.) aunque arrastrar la scrollbar sí funcionara.
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "#008080 url(/images/os/bliss.jpg) center/cover no-repeat",
            overflow: "hidden",
          }}
          onClickCapture={(e) => {
            const target = e.target as HTMLElement;
            if (
              startMenuOpen &&
              !target.closest("[data-start-menu]") &&
              !target.closest("[data-start-button]")
            ) {
              setStartMenuOpen(false);
            }
            if (selectedIcons.size > 0 && !target.closest("[data-desktop-icon]")) {
              setSelectedIcons(new Set());
            }
          }}
        >
          <style>{MINI_OS_CSS}</style>

          <AnimatePresence>{booting && <BootScreen />}</AnimatePresence>

          {/* Mientras arranca, no renderizamos nada del escritorio real —
              BootScreen hace su propio fade-in de opacidad (0 → 1), y
              mientras tanto es semi-transparente: si el escritorio ya
              estuviera pintado detrás, se alcanzaba a ver por unos
              instantes durante ese fundido. Así no hay nada que se pueda
              transparentar. */}
          {!booting && (
            <>
          {/* Íconos de escritorio: orden vertical por defecto (como un
              escritorio real), pero se pueden arrastrar a cualquier lado —
              la posición libre queda guardada por ícono. Arrastrar en el
              fondo vacío dibuja un rectángulo de selección ("goma") que
              selecciona todos los íconos que toque, como un escritorio real. */}
          <div
            ref={desktopRef}
            onPointerDown={onDesktopPointerDown}
            style={{ position: "absolute", inset: 0, zIndex: 5 }}
          >
            {DESKTOP_ICON_ORDER.map((iconId, index) => {
              const meta = iconId === "recycle-bin" ? null : APP_META[iconId];
              const label = meta ? meta.label : "Recycle Bin";
              const icon = meta ? meta.icon : `${ICONS}/recycle-bin2-32.png`;
              const defaultPos = getDefaultIconPos(index);
              const savedPos = desktopIconPositions[iconId];
              const onOpen =
                iconId === "recycle-bin" ? showFakeError : () => openApp(iconId);
              return (
                <DesktopIcon
                  key={iconId}
                  label={label}
                  icon={icon}
                  selected={selectedIcons.has(iconId)}
                  onSelect={() => setSelectedIcons(new Set([iconId]))}
                  onOpen={onOpen}
                  x={savedPos?.x ?? defaultPos.x}
                  y={savedPos?.y ?? defaultPos.y}
                  onDragEnd={(pos) => setDesktopIconPosition(iconId, pos)}
                />
              );
            })}
            {marquee && (
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: marquee.x,
                  top: marquee.y,
                  width: marquee.width,
                  height: marquee.height,
                  background: "rgba(11,97,255,0.15)",
                  border: "1px solid rgba(11,97,255,0.6)",
                  pointerEvents: "none",
                }}
              />
            )}
          </div>

          <AnimatePresence>
            {openWindows
              .filter((key) => key !== "winamp")
              .map((key, i) => (
                <AppWindow
                  key={key}
                  appId={key}
                  cascadeIndex={i}
                  zIndex={BASE_Z + openWindows.indexOf(key)}
                  minimized={minimizedApps.includes(key)}
                  focused={openWindows[openWindows.length - 1] === key}
                  onClose={() => closeApp(key)}
                  onFocus={() => focusApp(key)}
                  onMinimize={() => minimizeApp(key)}
                  onShutdown={onClose}
                  viewingImage={viewingImage}
                  viewingImageDate={viewingImageDate}
                  onOpenImage={openImage}
                />
              ))}
          </AnimatePresence>

          {/*
            Winamp se monta recién la primera vez que se abre, y desde ahí
            queda montado (solo oculto) mientras dure la sesión del mini-OS —
            nunca se desmonta al "cerrar" su ventana. Webamp advierte en su
            propia documentación que dispose() no limpia realmente la
            instancia ("it still leaks the whole instance"); crear una
            segunda instancia después de disponer la primera dejaba la app
            rota (no volvía a abrir). Mantener una única instancia viva evita
            el problema de raíz.
          */}
          {winampMounted && (
            <WinampErrorBoundary onError={() => closeApp("winamp")}>
              <WinampHost
                zIndex={BASE_Z + Math.max(openWindows.indexOf("winamp"), 0)}
                minimized={!openWindows.includes("winamp") || minimizedApps.includes("winamp")}
                onClose={() => closeApp("winamp")}
                onFocus={() => focusApp("winamp")}
                onMinimize={() => minimizeApp("winamp")}
              />
            </WinampErrorBoundary>
          )}

          {/* Barra de tareas */}
          <div className="mos-taskbar" style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 10 }}>
            <div className="mos-taskbar-left">
              <button
                data-start-button
                className={`mos-start-btn ${startMenuOpen ? "open" : ""}`}
                onClick={() => setStartMenuOpen((v) => !v)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${ICONS}/start.png`}
                  alt=""
                  width={20}
                  height={20}
                  draggable={false}
                  style={{ flexShrink: 0 }}
                />
                EdDev
              </button>
              {openWindows.map((key) => {
                const isTop = openWindows[openWindows.length - 1] === key;
                const isFocused = isTop && !minimizedApps.includes(key);
                return (
                  <button
                    key={key}
                    onClick={() => taskbarClick(key)}
                    className={`mos-task-btn ${isFocused ? "focus" : ""}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={APP_META[key].iconSmall} alt="" width={13} height={13} draggable={false} />
                    {APP_META[key].label}
                  </button>
                );
              })}
            </div>
            <div className="mos-taskbar-tray" style={{ position: "relative" }}>
              {isOnline && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${ICONS}/internet-16.png`}
                    alt="Conectado a internet"
                    width={16}
                    height={16}
                    draggable={false}
                    style={{ marginRight: "6px", cursor: "default" }}
                    onMouseEnter={() => setShowNetworkInfo(true)}
                    onMouseLeave={() => setShowNetworkInfo(false)}
                  />
                  {showNetworkInfo && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "100%",
                        right: 0,
                        marginBottom: "6px",
                        width: "220px",
                        background: "#ffffe1",
                        border: "1px solid #000",
                        boxShadow: "2px 2px 6px rgba(0,0,0,0.4)",
                        padding: "0.5rem 0.6rem",
                        fontFamily: WIN_FONT,
                        fontSize: "0.68rem",
                        color: "#000",
                        lineHeight: 1.5,
                        zIndex: 40,
                      }}
                    >
                      <strong>Conectado a internet</strong>
                      <br />
                      {networkInfo ? (
                        <>
                          IP: {networkInfo.ip}
                          <br />
                          Ubicación: {networkInfo.city}
                          {networkInfo.city && networkInfo.country ? ", " : ""}
                          {networkInfo.country}
                        </>
                      ) : (
                        "Buscando ubicación..."
                      )}
                    </div>
                  )}
                </>
              )}
              {time}
            </div>
          </div>

          <AnimatePresence>
            {messengerToastOpen && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  bottom: `${TASKBAR_HEIGHT + 12}px`,
                  width: "260px",
                  background: "linear-gradient(180deg, #ffffff 0%, #eef6ff 100%)",
                  border: "1px solid #3a6ea5",
                  borderRadius: "4px",
                  boxShadow: "2px 2px 10px rgba(0,0,0,0.45)",
                  fontFamily: WIN_FONT,
                  zIndex: 100,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.4rem 0.5rem",
                    background: "linear-gradient(180deg, #6bbf3f 0%, #3e8e1f 100%)",
                  }}
                >
                  {/* Ícono de "chat" original (no el logo real de MSN
                      Messenger, que es una marca registrada de Microsoft). */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4.4 3.3A.6.6 0 0 1 3.6 19V16H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
                      fill="#fff"
                    />
                  </svg>
                  <strong style={{ fontSize: "0.72rem", color: "#fff" }}>New message</strong>
                  <button
                    onClick={() => setMessengerToastOpen(false)}
                    aria-label="Cerrar notificación"
                    style={{
                      marginLeft: "auto",
                      background: "transparent",
                      border: "none",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                      lineHeight: 1,
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div
                  style={{
                    padding: "0.6rem 0.65rem",
                    fontSize: "0.72rem",
                    lineHeight: 1.5,
                    color: "#000",
                  }}
                >
                  Es un placer que tengas interés en mi perfil profesional.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {startMenuOpen && (
              <StartMenu
                recentApps={recentApps}
                onOpenApp={openApp}
                onGoToSection={(sectionId) => {
                  setStartMenuOpen(false);
                  onClose();
                  setTimeout(() => {
                    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
                  }, 150);
                }}
                onShowFakeError={() => {
                  setStartMenuOpen(false);
                  showFakeError();
                }}
                onSuspend={() => {
                  setStartMenuOpen(false);
                  setSuspended(true);
                }}
                onShutdown={onClose}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {suspended && <SuspendedOverlay onWake={() => setSuspended(false)} />}
          </AnimatePresence>

          <AnimatePresence>
            {fakeErrorOpen && <FakeErrorDialog onClose={() => setFakeErrorOpen(false)} />}
          </AnimatePresence>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
