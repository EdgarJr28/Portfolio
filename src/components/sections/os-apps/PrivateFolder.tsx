"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { WIN_FONT } from "./shared";

/**
 * Carpeta protegida por contraseña. La contraseña real vive solo en el
 * servidor (variable de entorno PRIVATE_FOLDER_PASSWORD) y se valida vía
 * /api/private-folder/verify — nunca se compara del lado del cliente, así
 * que no hay forma de leerla en el código fuente del navegador.
 *
 * "Desbloqueada" es estado local del componente, no persistido: cada vez
 * que se vuelve a abrir esta ventana hay que ingresar la contraseña de
 * nuevo, a propósito (persistirlo rompería el sentido de tener contraseña).
 */
export default function PrivateFolder() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const submit = async () => {
    if (!password || checking) return;
    setChecking(true);
    setError(false);
    try {
      const res = await fetch("/api/private-folder/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok?: boolean };
      if (data.ok) {
        setUnlocked(true);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setChecking(false);
      setPassword("");
    }
  };

  if (!unlocked) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: "0.7rem",
          padding: "1rem",
          background: "#ece9d8",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/os/icons/lock-32.png" alt="" width={32} height={32} draggable={false} />
        <p style={{ fontFamily: WIN_FONT, fontSize: "0.78rem", color: "#000", margin: 0 }}>
          Esta carpeta está protegida con contraseña
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Contraseña"
          autoFocus
          style={{
            width: "200px",
            padding: "0.35rem 0.5rem",
            border: "1px inset #9a9584",
            fontFamily: WIN_FONT,
            fontSize: "0.75rem",
          }}
        />
        <button
          onClick={submit}
          disabled={checking || !password}
          style={{
            padding: "0.35rem 1rem",
            background: "linear-gradient(180deg, #fff 0%, #e3e3e3 50%, #c6c6c6 100%)",
            border: "1px solid #8a8a8a",
            borderRadius: "3px",
            fontFamily: WIN_FONT,
            fontSize: "0.72rem",
            color: "#000",
            cursor: checking || !password ? "default" : "pointer",
            opacity: checking || !password ? 0.6 : 1,
          }}
        >
          {checking ? "Verificando..." : "Desbloquear"}
        </button>
        {error && (
          <p style={{ fontFamily: WIN_FONT, fontSize: "0.7rem", color: "#c0392b", margin: 0 }}>
            Contraseña incorrecta.
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{ height: "100%", background: "#fff", padding: "0.9rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1rem" }}>
        <FontAwesomeIcon icon={faFolderOpen} color="#e8b84b" width={16} />
        <span style={{ fontFamily: WIN_FONT, fontSize: "0.75rem", color: "#000" }}>
          Carpeta privada
        </span>
      </div>
      <p style={{ fontFamily: WIN_FONT, fontSize: "0.75rem", color: "#555", margin: 0 }}>
        Esta carpeta está vacía por ahora.
      </p>
    </div>
  );
}
