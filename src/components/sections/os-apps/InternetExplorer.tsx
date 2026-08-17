"use client";

import { useState, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faRotateRight,
  faHouse,
  faMagnifyingGlass,
  faMicrophone,
  faStar,
  faEnvelope,
  faPrint,
  faXmark,
  faFaceSmile,
} from "@fortawesome/free-solid-svg-icons";
import MenuBar from "./MenuBar";
import { WIN_FONT } from "./shared";
import type { MenuData } from "./shared";
import { useScrollMemory } from "./useScrollMemory";
import { useLang } from "@/context/LangContext";
import type { Lang } from "@/context/LangContext";
import { t, tr } from "@/lib/i18n";
import LoverboyEasterEgg from "./LoverboyEasterEgg";
import IcemanYoutubeEasterEgg from "./IcemanYoutubeEasterEgg";
import FacebookEasterEgg from "./FacebookEasterEgg";

// ─── Photo viewer (renders inside IE window, not viewport) ───────────────────

interface ViewerState { images: string[]; index: number; date: string }

function PhotoViewer({ state, onClose, onChange, lang }: { state: ViewerState; onClose: () => void; onChange: (i: number) => void; lang: Lang }) {
  const { images, index, date } = state;
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onChange(index - 1);
      if (e.key === "ArrowRight" && hasNext) onChange(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, hasPrev, hasNext, onClose, onChange]);

  const arrowBtn = (disabled: boolean, label: string, char: string, onClick: () => void, side: "left" | "right") => (
    <button onClick={onClick} disabled={disabled} aria-label={label} style={{
      position: "absolute", top: "50%", transform: "translateY(-50%)",
      [side]: 8, background: disabled ? "rgba(0,0,0,0.1)" : "rgba(0,0,0,0.5)",
      color: "#fff", border: "none", borderRadius: "50%", width: 30, height: 30,
      fontSize: "1rem", cursor: disabled ? "default" : "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      opacity: disabled ? 0.25 : 1, zIndex: 2,
    }}>{char}</button>
  );

  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ display: "flex", maxWidth: "95%", maxHeight: "90%", background: "#1c1e21", borderRadius: 4, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.7)" }}>
        {/* Image */}
        <div style={{ position: "relative", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", maxWidth: "68%" }}>
          <img src={images[index]} alt="" style={{ maxWidth: "100%", maxHeight: "88vh", objectFit: "contain", display: "block" }} />
          {arrowBtn(!hasPrev, tr(t.os.pv_prev, lang), "‹", () => hasPrev && onChange(index - 1), "left")}
          {arrowBtn(!hasNext, tr(t.os.pv_next, lang), "›", () => hasNext && onChange(index + 1), "right")}
          <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.5)", color: "#fff", borderRadius: 10, padding: "2px 10px", fontFamily: WIN_FONT, fontSize: "0.63rem" }}>
            {index + 1} {tr(t.os.pv_of, lang)} {images.length}
          </div>
        </div>
        {/* Panel */}
        <div style={{ width: 200, flexShrink: 0, display: "flex", flexDirection: "column", background: "#1c1e21", color: "#e4e6eb" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderBottom: "1px solid #3a3b3c" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img src="/images/me.JPEG" alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
              <div>
                <div style={{ fontFamily: WIN_FONT, fontSize: "0.68rem", fontWeight: 700, color: "#e4e6eb" }}>Edgar Maldonado</div>
                <div style={{ fontFamily: WIN_FONT, fontSize: "0.58rem", color: "#b0b3b8" }}>{date}</div>
              </div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "#b0b3b8", fontSize: "1rem", cursor: "pointer", padding: 2 }}>✕</button>
          </div>
          <div style={{ flex: 1, padding: "10px 12px" }}>
            <div style={{ fontFamily: WIN_FONT, fontSize: "0.63rem", color: "#b0b3b8" }}>{tr(t.os.pv_no_comments, lang)}</div>
          </div>
          <div style={{ borderTop: "1px solid #3a3b3c", padding: "8px 12px" }}>
            <div style={{ fontFamily: WIN_FONT, fontSize: "0.6rem", color: "#b0b3b8", marginBottom: 6 }}>👍 {tr(t.os.pv_likes, lang)}</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[tr(t.os.pv_like, lang), tr(t.os.pv_comment, lang)].map((l) => (
                <button key={l} style={{ flex: 1, background: "#3a3b3c", border: "none", borderRadius: 4, padding: "4px 0", color: "#e4e6eb", fontFamily: WIN_FONT, fontSize: "0.58rem", cursor: "pointer" }}>{l}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const HOME_URL = "http://buscador.fake";
const SEARCH_PREFIX = "http://buscador.fake/search?q=";

const WORDMARK_STYLE: React.CSSProperties = {
  fontFamily: "Georgia, serif",
  fontWeight: 700,
  background: "linear-gradient(90deg, #4285f4, #ea4335, #fbbc05, #34a853)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

function TopNavLinks({ lang }: { lang: Lang }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "0.6rem",
        right: "0.9rem",
        display: "flex",
        alignItems: "center",
        gap: "0.9rem",
        fontFamily: WIN_FONT,
        fontSize: "0.7rem",
      }}
    >
      {t.os.ie_top_links[lang].map((label) => (
        <span key={label} style={{ color: "#444", cursor: "default" }}>
          {label}
        </span>
      ))}
      <span
        aria-hidden="true"
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          border: "1.5px solid #666",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <FontAwesomeIcon icon={faFaceSmile} width={12} color="#666" />
      </span>
    </div>
  );
}

function SearchBox({
  value,
  onChange,
  onSubmit,
  width,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  width: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        width,
        padding: "0.4rem 0.8rem",
        border: "1px solid #999",
        borderRadius: "22px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
      }}
    >
      <FontAwesomeIcon icon={faMagnifyingGlass} width={12} color="#999" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          fontFamily: WIN_FONT,
          fontSize: "0.78rem",
        }}
      />
      <FontAwesomeIcon icon={faMicrophone} width={12} color="#4285f4" />
    </div>
  );
}

function SearchResultsPage({
  query,
  onSearch,
}: {
  query: string;
  onSearch: (q: string) => void;
}) {
  const { lang } = useLang();
  const [draft, setDraft] = useState(query);
  const tabs = t.os.ie_tabs[lang];

  return (
    <div style={{ padding: "0.9rem 1.4rem", position: "relative" }}>
      <TopNavLinks lang={lang} />
      <div style={{ display: "flex", alignItems: "center", gap: "1.2rem", marginBottom: "1rem", marginTop: "1.6rem" }}>
        <span style={{ ...WORDMARK_STYLE, fontSize: "1.4rem" }}>FakeScope</span>
        <SearchBox value={draft} onChange={setDraft} onSubmit={() => onSearch(draft)} width="360px" />
      </div>

      <div
        style={{
          display: "flex",
          gap: "1.1rem",
          borderBottom: "1px solid #ddd",
          paddingBottom: "0.4rem",
          marginBottom: "1rem",
          fontFamily: WIN_FONT,
          fontSize: "0.72rem",
        }}
      >
        {tabs.map((tab, i) => (
          <span
            key={tab}
            style={{
              color: i === 0 ? "#1a0dab" : "#555",
              fontWeight: i === 0 ? 700 : 400,
              borderBottom: i === 0 ? "2px solid #1a0dab" : "none",
              paddingBottom: "0.3rem",
            }}
          >
            {tab}
          </span>
        ))}
      </div>

      <p style={{ fontFamily: WIN_FONT, fontSize: "0.8rem", color: "#000", margin: "0 0 1rem" }}>
        {tr(t.os.ie_your_search, lang)} <strong>{query}</strong> {tr(t.os.ie_no_match, lang)}
      </p>
      <p style={{ fontFamily: WIN_FONT, fontSize: "0.78rem", color: "#000", margin: "0 0 0.4rem" }}>
        {tr(t.os.ie_suggestions, lang)}
      </p>
      <ul style={{ fontFamily: WIN_FONT, fontSize: "0.78rem", color: "#000", margin: 0, paddingLeft: "1.4rem", lineHeight: 1.7 }}>
        <li>{tr(t.os.ie_sug1, lang)}</li>
        <li>{tr(t.os.ie_sug2, lang)}</li>
        <li>{tr(t.os.ie_sug3, lang)}</li>
      </ul>
    </div>
  );
}

function HomePage({ onSearch }: { onSearch: (q: string) => void }) {
  const { lang } = useLang();
  const [draft, setDraft] = useState("");

  return (
    <div style={{ textAlign: "center", padding: "3rem 1rem", position: "relative", height: "100%" }}>
      <TopNavLinks lang={lang} />
      <h1 style={{ ...WORDMARK_STYLE, fontSize: "2.8rem", margin: "2rem 0 1.5rem" }}>
        FakeScope
      </h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <SearchBox value={draft} onChange={setDraft} onSubmit={() => onSearch(draft)} width="280px" />
      </div>
      <div style={{ marginTop: "1.2rem", display: "flex", justifyContent: "center", gap: "0.6rem" }}>
        <button
          onClick={() => onSearch(draft)}
          style={{
            padding: "0.4rem 0.9rem",
            background: "#f2f2f2",
            border: "1px solid #ccc",
            borderRadius: "3px",
            fontFamily: WIN_FONT,
            fontSize: "0.72rem",
            cursor: "pointer",
            color: "#000",
          }}
        >
          {tr(t.os.ie_search_web, lang)}
        </button>
        <button
          onClick={() => onSearch(draft || "luck")}
          style={{
            padding: "0.4rem 0.9rem",
            background: "#f2f2f2",
            border: "1px solid #ccc",
            borderRadius: "3px",
            fontFamily: WIN_FONT,
            fontSize: "0.72rem",
            cursor: "pointer",
            color: "#000",
          }}
        >
          {tr(t.os.ie_lucky, lang)}
        </button>
      </div>
    </div>
  );
}

const STATIC_PAGES: Record<string, { title: string; body: (onSearch: (q: string) => void) => React.ReactNode }> = {
  [HOME_URL]: {
    title: "FakeScope",
    body: (onSearch) => <HomePage onSearch={onSearch} />,
  },
};

function ErrorPage({ lang }: { lang: Lang }) {
  return (
    <div style={{ padding: "1.5rem" }}>
      <h2 style={{ fontFamily: WIN_FONT, fontSize: "1rem", color: "#000" }}>
        {tr(t.os.ie_error_title, lang)}
      </h2>
      <p style={{ fontFamily: WIN_FONT, fontSize: "0.78rem", lineHeight: 1.6, color: "#000" }}>
        {tr(t.os.ie_error_body, lang)}
      </p>
    </div>
  );
}

function getToolbarMenu(lang: Lang): MenuData {
  return (lang === "es"
    ? {
        Archivo: [
          { type: "item" as const, text: "Nueva ventana", disabled: true },
          { type: "item" as const, text: "Abrir...", disabled: true },
          { type: "separator" as const },
          { type: "item" as const, text: "Imprimir...", disabled: true },
        ],
        Editar: [
          { type: "item" as const, text: "Cortar", disabled: true },
          { type: "item" as const, text: "Copiar", disabled: true },
          { type: "item" as const, text: "Pegar", disabled: true },
        ],
        Ver: [
          { type: "item" as const, text: "Barra de herramientas", disabled: true },
          { type: "item" as const, text: "Actualizar", disabled: true },
        ],
        Favoritos: [{ type: "item" as const, text: "Agregar a Favoritos...", disabled: true }],
        Herramientas: [{ type: "item" as const, text: "Opciones de Internet...", disabled: true }],
        Ayuda: [{ type: "item" as const, text: "Acerca de Internet Explorer", disabled: true }],
      }
    : {
        File: [
          { type: "item" as const, text: "New window", disabled: true },
          { type: "item" as const, text: "Open...", disabled: true },
          { type: "separator" as const },
          { type: "item" as const, text: "Print...", disabled: true },
        ],
        Edit: [
          { type: "item" as const, text: "Cut", disabled: true },
          { type: "item" as const, text: "Copy", disabled: true },
          { type: "item" as const, text: "Paste", disabled: true },
        ],
        View: [
          { type: "item" as const, text: "Toolbar", disabled: true },
          { type: "item" as const, text: "Refresh", disabled: true },
        ],
        Favorites: [{ type: "item" as const, text: "Add to Favorites...", disabled: true }],
        Tools: [{ type: "item" as const, text: "Internet Options...", disabled: true }],
        Help: [{ type: "item" as const, text: "About Internet Explorer", disabled: true }],
      }) as MenuData;
}

function ToolbarButton({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: typeof faHouse;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1px",
        background: "transparent",
        border: "none",
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "default" : "pointer",
        padding: "2px 6px",
        fontFamily: WIN_FONT,
        fontSize: "0.6rem",
        color: "#000",
      }}
    >
      <FontAwesomeIcon icon={icon} width={15} />
      {label}
    </button>
  );
}

/** Navegador falso estilo IE6, con "FakeScope" como página de inicio. */
export default function InternetExplorer() {
  const { lang } = useLang();
  const [url, setUrl] = useState(HOME_URL);
  const [draft, setDraft] = useState(HOME_URL);
  const [loading, setLoading] = useState(false);
  const [viewer, setViewer] = useState<ViewerState | null>(null);
  const { ref: scrollRef, onScroll } = useScrollMemory<HTMLDivElement>("ie");

  const openViewer = useCallback((images: string[], index: number, date: string) => {
    setViewer({ images, index, date });
  }, []);
  const closeViewer = useCallback(() => setViewer(null), []);
  const changeViewer = useCallback((i: number) => setViewer((v) => v ? { ...v, index: i } : v), []);

  const navigate = (target: string) => {
    const isSearch = target.startsWith(SEARCH_PREFIX);
    const dest = isSearch || STATIC_PAGES[target] ? target : "http://error.fake";
    setLoading(true);
    setUrl(dest);
    setDraft(dest);
    setTimeout(() => setLoading(false), 350);
  };

  const search = (query: string) => {
    const q = query.trim();
    if (!q) return;
    navigate(`${SEARCH_PREFIX}${encodeURIComponent(q)}`);
  };

  const searchQuery = url.startsWith(SEARCH_PREFIX)
    ? decodeURIComponent(url.slice(SEARCH_PREFIX.length))
    : null;
  const staticPage = STATIC_PAGES[url];
  // Easter egg: buscar "maited" activa la escena de la carta + flores en
  // vez de la página de resultados de siempre.
  const isMaitedEgg = searchQuery?.trim().toLowerCase() === "maited";
  // Easter egg: buscar "iceman" reproduce el video real del easter egg
  // dentro de una plantilla estilo sitio de videos circa 2008.
  const isIcemanEgg = searchQuery?.trim().toLowerCase() === "iceman";
  const isFacebookEgg = searchQuery?.trim().toLowerCase() === "facebook";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff", position: "relative" }}>
      {viewer && <PhotoViewer state={viewer} onClose={closeViewer} onChange={changeViewer} lang={lang} />}
      <MenuBar data={getToolbarMenu(lang)} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.1rem",
          padding: "2px 6px",
          background: "#ece9d8",
          borderBottom: "1px solid #9a9584",
        }}
      >
        <ToolbarButton icon={faArrowLeft} label={tr(t.os.ie_back, lang)} disabled />
        <ToolbarButton icon={faArrowRight} label={tr(t.os.ie_forward, lang)} disabled />
        <ToolbarButton icon={faXmark} label={tr(t.os.ie_stop, lang)} disabled />
        <ToolbarButton icon={faRotateRight} label={tr(t.os.ie_refresh, lang)} onClick={() => navigate(url)} />
        <ToolbarButton icon={faHouse} label={tr(t.os.ie_home, lang)} onClick={() => navigate(HOME_URL)} />
        <div style={{ width: "1px", height: "28px", background: "#c8c2b0", margin: "0 3px" }} />
        <ToolbarButton icon={faMagnifyingGlass} label={tr(t.os.ie_search_btn, lang)} disabled />
        <ToolbarButton icon={faStar} label={tr(t.os.ie_favorites, lang)} disabled />
        <ToolbarButton icon={faEnvelope} label={tr(t.os.ie_mail, lang)} disabled />
        <ToolbarButton icon={faPrint} label={tr(t.os.ie_print, lang)} disabled />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          padding: "4px 6px",
          background: "#ece9d8",
          borderBottom: "1px solid #9a9584",
        }}
      >
        <span style={{ fontFamily: WIN_FONT, fontSize: "0.7rem", flexShrink: 0, color: "#000" }}>
          {tr(t.os.ie_address, lang)}
        </span>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && navigate(draft)}
          style={{
            flex: 1,
            padding: "2px 6px",
            border: "1px inset #9a9584",
            fontFamily: WIN_FONT,
            fontSize: "0.72rem",
            color: "#000",
          }}
        />
        <button
          onClick={() => navigate(draft)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            padding: "2px 8px",
            background: "linear-gradient(180deg, #fff 0%, #e3e3e3 50%, #c6c6c6 100%)",
            border: "1px solid #8a8a8a",
            borderRadius: "3px",
            fontFamily: WIN_FONT,
            fontSize: "0.7rem",
            cursor: "pointer",
            color: "#000",
          }}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} width={9} />
          {tr(t.os.ie_go, lang)}
        </button>
        <span style={{ fontFamily: WIN_FONT, fontSize: "0.68rem", color: "#555", flexShrink: 0 }}>
          Links »
        </span>
      </div>
      <div
        ref={scrollRef}
        onScroll={onScroll}
        data-mos-scroll
        style={{ flex: 1, minHeight: 0, overflowY: "auto", position: "relative" }}
      >
        {loading ? (
          <div style={{ padding: "1.5rem", fontFamily: WIN_FONT, fontSize: "0.75rem", color: "#555" }}>
            {tr(t.os.ie_loading, lang)} {url}...
          </div>
        ) : isMaitedEgg ? (
          <LoverboyEasterEgg key={url} />
        ) : isIcemanEgg ? (
          <IcemanYoutubeEasterEgg key={url} />
        ) : isFacebookEgg ? (
          <FacebookEasterEgg key={url} onOpenViewer={openViewer} />
        ) : searchQuery !== null ? (
          <SearchResultsPage key={url} query={searchQuery} onSearch={search} />
        ) : url === "http://error.fake" ? (
          <ErrorPage lang={lang} />
        ) : (
          staticPage?.body(search)
        )}
      </div>
      <div
        style={{
          borderTop: "1px solid #9a9584",
          padding: "1px 6px",
          fontFamily: WIN_FONT,
          fontSize: "0.65rem",
          color: "#444",
        }}
      >
        {loading ? tr(t.os.ie_connecting, lang) : tr(t.os.ie_ready, lang)}
      </div>
    </div>
  );
}
