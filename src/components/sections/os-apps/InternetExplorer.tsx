"use client";

import { useState } from "react";
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
import { useScrollMemory } from "./useScrollMemory";
import LoverboyEasterEgg from "./LoverboyEasterEgg";
import IcemanYoutubeEasterEgg from "./IcemanYoutubeEasterEgg";

const HOME_URL = "http://buscador.fake";
const SEARCH_PREFIX = "http://buscador.fake/search?q=";

const WORDMARK_STYLE: React.CSSProperties = {
  fontFamily: "Georgia, serif",
  fontWeight: 700,
  background: "linear-gradient(90deg, #4285f4, #ea4335, #fbbc05, #34a853)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const SEARCH_TABS = ["Todo", "Imágenes", "Noticias", "Videos", "Más"];

const TOP_LINKS = ["Correo", "Imágenes"];

function TopNavLinks() {
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
      {TOP_LINKS.map((label) => (
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

/**
 * Página de resultados falsa: siempre "no encontrado", en español. Nota
 * para más adelante (no implementar todavía, a pedido): eventualmente el
 * plan es que ciertas búsquedas linkeen a secciones reales del portfolio en
 * vez de mostrar "sin resultados" — una especie de traductor de queries a
 * anclas de la página. Por ahora es 100% falso.
 */
function SearchResultsPage({
  query,
  onSearch,
}: {
  query: string;
  onSearch: (q: string) => void;
}) {
  const [draft, setDraft] = useState(query);

  return (
    <div style={{ padding: "0.9rem 1.4rem", position: "relative" }}>
      <TopNavLinks />
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
        {SEARCH_TABS.map((tab, i) => (
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
        Tu búsqueda — <strong>{query}</strong> — no coincidió con ningún documento.
      </p>
      <p style={{ fontFamily: WIN_FONT, fontSize: "0.78rem", color: "#000", margin: "0 0 0.4rem" }}>
        Sugerencias:
      </p>
      <ul style={{ fontFamily: WIN_FONT, fontSize: "0.78rem", color: "#000", margin: 0, paddingLeft: "1.4rem", lineHeight: 1.7 }}>
        <li>Asegurate de que todas las palabras estén bien escritas.</li>
        <li>Prueba con otras palabras clave.</li>
        <li>Prueba con palabras clave más generales.</li>
      </ul>
    </div>
  );
}

function HomePage({ onSearch }: { onSearch: (q: string) => void }) {
  const [draft, setDraft] = useState("");

  return (
    <div style={{ textAlign: "center", padding: "3rem 1rem", position: "relative", height: "100%" }}>
      <TopNavLinks />
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
          Buscar
        </button>
        <button
          onClick={() => onSearch(draft || "suerte")}
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
          Voy a tener suerte
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
  "http://error.fake": {
    title: "No se puede mostrar la página",
    body: () => (
      <div style={{ padding: "1.5rem" }}>
        <h2 style={{ fontFamily: WIN_FONT, fontSize: "1rem", color: "#000" }}>
          No se puede mostrar la página
        </h2>
        <p style={{ fontFamily: WIN_FONT, fontSize: "0.78rem", lineHeight: 1.6, color: "#000" }}>
          La página que estás buscando no está disponible en este universo.
          Prueba con otra dirección de la lista, o volvé a la página de inicio.
        </p>
      </div>
    ),
  },
};

const TOOLBAR_MENU = {
  File: [
    { type: "item" as const, text: "Nueva ventana", disabled: true },
    { type: "item" as const, text: "Abrir...", disabled: true },
    { type: "separator" as const },
    { type: "item" as const, text: "Imprimir...", disabled: true },
  ],
  Edit: [
    { type: "item" as const, text: "Cortar", disabled: true },
    { type: "item" as const, text: "Copiar", disabled: true },
    { type: "item" as const, text: "Pegar", disabled: true },
  ],
  View: [
    { type: "item" as const, text: "Barra de herramientas", disabled: true },
    { type: "item" as const, text: "Actualizar", disabled: true },
  ],
  Favoritos: [{ type: "item" as const, text: "Agregar a Favoritos...", disabled: true }],
  Tools: [{ type: "item" as const, text: "Opciones de Internet...", disabled: true }],
  Help: [{ type: "item" as const, text: "Acerca de Internet Explorer", disabled: true }],
};

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
  const [url, setUrl] = useState(HOME_URL);
  const [draft, setDraft] = useState(HOME_URL);
  const [loading, setLoading] = useState(false);
  const { ref: scrollRef, onScroll } = useScrollMemory<HTMLDivElement>("ie");

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

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff" }}>
      <MenuBar data={TOOLBAR_MENU} />
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
        <ToolbarButton icon={faArrowLeft} label="Atrás" disabled />
        <ToolbarButton icon={faArrowRight} label="Adelante" disabled />
        <ToolbarButton icon={faXmark} label="Detener" disabled />
        <ToolbarButton icon={faRotateRight} label="Actualizar" onClick={() => navigate(url)} />
        <ToolbarButton icon={faHouse} label="Inicio" onClick={() => navigate(HOME_URL)} />
        <div style={{ width: "1px", height: "28px", background: "#c8c2b0", margin: "0 3px" }} />
        <ToolbarButton icon={faMagnifyingGlass} label="Buscar" disabled />
        <ToolbarButton icon={faStar} label="Favoritos" disabled />
        <ToolbarButton icon={faEnvelope} label="Correo" disabled />
        <ToolbarButton icon={faPrint} label="Imprimir" disabled />
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
          Dirección
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
          Ir
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
            Cargando {url}...
          </div>
        ) : isMaitedEgg ? (
          <LoverboyEasterEgg key={url} />
        ) : isIcemanEgg ? (
          <IcemanYoutubeEasterEgg key={url} />
        ) : searchQuery !== null ? (
          <SearchResultsPage key={url} query={searchQuery} onSearch={search} />
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
        {loading ? "Conectando..." : "Listo"}
      </div>
    </div>
  );
}
