/**
 * Genera un nuevo SPOTIFY_REFRESH_TOKEN (Authorization Code Flow).
 *
 * Requisito previo: en https://developer.spotify.com/dashboard, abre tu app →
 * Settings → Redirect URIs → añade exactamente:
 *
 *     http://127.0.0.1:8888/callback
 *
 * Uso:  node scripts/spotify-token.mjs
 *
 * Sin dependencias externas: usa http + fetch nativos de Node 20+.
 */

import http from "node:http";
import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

// Por defecto usa el loopback estándar, pero puedes forzar cualquier URI ya
// registrada en el dashboard:
//     SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/callback npm run spotify:token
// El puerto y la ruta del servidor local se derivan de esta URI.
const REDIRECT_URI =
  process.env.SPOTIFY_REDIRECT_URI || "http://127.0.0.1:8888/callback";

const REDIRECT = new URL(REDIRECT_URI);
const PORT = Number(REDIRECT.port) || 80;
const CALLBACK_PATH = REDIRECT.pathname;

// Scopes que necesita src/lib/spotify.ts
const SCOPES = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-read-recently-played",
  "user-read-private",
  "playlist-read-private",
  "user-top-read",
].join(" ");

// ─── Leer credenciales de .env (sin dependencias) ───────────────────────────
function loadEnv() {
  const out = {};
  for (const file of [".env.local", ".env"]) {
    let raw;
    try {
      raw = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
    } catch {
      continue;
    }
    for (const line of raw.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!m) continue;
      const value = m[2].trim().replace(/^["']|["']$/g, "");
      if (value && out[m[1]] === undefined) out[m[1]] = value;
    }
  }
  return out;
}

const env = loadEnv();
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET =
  process.env.SPOTIFY_CLIENT_SECRET || env.SPOTIFY_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "\n✗ Faltan SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET en .env o .env.local\n"
  );
  process.exit(1);
}

const state = randomBytes(16).toString("hex");

const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    state,
    // Fuerza la pantalla de consentimiento aunque ya hubiera autorizado antes
    show_dialog: "true",
  });

// ─── Intercambiar el code por tokens ────────────────────────────────────────
async function exchangeCode(code) {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(
      `${body.error ?? res.status}: ${body.error_description ?? "sin detalle"}`
    );
  }
  return body;
}

// ─── Servidor local que recibe el callback ──────────────────────────────────
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  if (url.pathname !== CALLBACK_PATH) {
    res.writeHead(404).end("Not found");
    return;
  }

  const reply = (msg) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(
      `<body style="font-family:system-ui;padding:3rem;background:#121212;color:#fff">${msg}</body>`
    );
  };

  const error = url.searchParams.get("error");
  if (error) {
    reply(`<h2>✗ Autorización denegada</h2><p>${error}</p>`);
    console.error(`\n✗ Spotify devolvió: ${error}\n`);
    server.close();
    process.exitCode = 1;
    return;
  }

  if (url.searchParams.get("state") !== state) {
    reply("<h2>✗ State no coincide</h2><p>Posible CSRF. Reinicia el script.</p>");
    console.error("\n✗ El parámetro 'state' no coincide. Abortado.\n");
    server.close();
    process.exitCode = 1;
    return;
  }

  try {
    const tokens = await exchangeCode(url.searchParams.get("code"));
    reply("<h2>✓ Listo</h2><p>Vuelve a la terminal para copiar el token.</p>");

    console.log("\n" + "─".repeat(72));
    console.log("✓ Nuevo refresh token. Pégalo en .env (reemplaza el anterior):\n");
    console.log(`SPOTIFY_REFRESH_TOKEN=${tokens.refresh_token}`);
    console.log("\nScopes concedidos: " + tokens.scope);
    console.log("─".repeat(72));
    console.log("\nDespués reinicia el dev server (Next lee .env solo al arrancar).\n");
  } catch (err) {
    reply(`<h2>✗ Error</h2><pre>${err.message}</pre>`);
    console.error(`\n✗ Fallo al canjear el code: ${err.message}\n`);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("\n" + "─".repeat(72));
  console.log("redirect_uri enviado a Spotify (debe estar en el dashboard,");
  console.log("carácter por carácter, sin barra final):\n");
  console.log(`    ${REDIRECT_URI}`);
  console.log("─".repeat(72));
  console.log("\nAbre esta URL en el navegador (sesión de TU cuenta de Spotify):\n");
  console.log(authUrl + "\n");
  console.log(`Esperando el callback en ${REDIRECT_URI} …\n`);
});
