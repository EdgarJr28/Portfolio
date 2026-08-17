const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API = "https://api.spotify.com/v1";

function basic() {
  return (
    "Basic " +
    Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString("base64")
  );
}

// ─── Access token cache (user) ───────────────────────────────────────────────
let userToken = "";
let userTokenExp = 0;

async function getAccessToken(): Promise<string> {
  if (userToken && Date.now() < userTokenExp - 60_000) return userToken;
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { Authorization: basic(), "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN ?? "",
    }),
  });
  const data = (await res.json()) as { access_token: string; expires_in: number };
  userToken = data.access_token;
  userTokenExp = Date.now() + data.expires_in * 1000;
  return userToken;
}

// ─── Client credentials token cache (public) ────────────────────────────────
let ccToken = "";
let ccTokenExp = 0;

async function getClientToken(): Promise<string> {
  if (ccToken && Date.now() < ccTokenExp - 60_000) return ccToken;
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { Authorization: basic(), "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });
  const data = (await res.json()) as { access_token: string; expires_in: number };
  ccToken = data.access_token;
  ccTokenExp = Date.now() + data.expires_in * 1000;
  return ccToken;
}

async function get<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Spotify ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// ─── Exported functions ──────────────────────────────────────────────────────

export async function getCurrentTrack() {
  const token = await getAccessToken();
  try {
    const res = await fetch(
      `${API}/me/player/currently-playing?additional_types=track,episode`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.status === 204 || !res.ok) return null;
    const data = (await res.json()) as {
      item: SpotifyTrack | null;
      progress_ms: number | null;
    };
    if (!data.item) return null;
    return { ...data.item, progress_ms: data.progress_ms ?? 0 };
  } catch {
    return null;
  }
}

export async function getPlaybackState(): Promise<boolean> {
  const token = await getAccessToken();
  try {
    const res = await fetch(`${API}/me/player`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 204 || !res.ok) return false;
    const data = (await res.json()) as { is_playing?: boolean };
    return data.is_playing ?? false;
  } catch {
    return false;
  }
}

export async function getLastPlayedTrack() {
  const token = await getAccessToken();
  try {
    const data = await get<{ items: { track: SpotifyTrack }[] }>(
      "/me/player/recently-played?limit=1",
      token
    );
    return data.items[0]?.track ?? null;
  } catch {
    return null;
  }
}

export async function getRecentlyPlayedTracks(limit = 10) {
  const token = await getAccessToken();
  try {
    const data = await get<{ items: { track: SpotifyTrack }[] }>(
      `/me/player/recently-played?limit=${limit}`,
      token
    );
    const seen = new Set<string>();
    const tracks: SpotifyTrack[] = [];
    for (const { track } of data.items) {
      if (!track || seen.has(track.id)) continue;
      seen.add(track.id);
      tracks.push(track);
    }
    return tracks;
  } catch (err) {
    console.error("[getRecentlyPlayedTracks]", err);
    return [];
  }
}

export async function getTopTracks(
  limit = 5,
  timeRange: "short_term" | "medium_term" | "long_term" = "medium_term"
) {
  const token = await getAccessToken();
  try {
    const data = await get<{ items: SpotifyTrack[] }>(
      `/me/top/tracks?limit=${limit}&time_range=${timeRange}`,
      token
    );
    return data.items.map((track) => ({
      id: track.id,
      title: track.name,
      artist: track.artists[0]?.name ?? "",
      albumImage: track.album.images[1]?.url ?? track.album.images[0]?.url ?? "",
      songUrl: track.external_urls.spotify ?? "",
      durationMs: track.duration_ms,
    }));
  } catch (err) {
    console.error("[getTopTracks]", err);
    return [];
  }
}

export async function getPlaylists() {
  try {
    const userTok = await getAccessToken();
    const me = await get<{ id: string }>("/me", userTok);

    const ccTok = await getClientToken();
    const data = await get<{ items: SpotifyPlaylist[] }>(
      `/users/${me.id}/playlists?limit=50`,
      ccTok
    );
    return data.items.filter((p) => p.images?.[0]?.url);
  } catch (err) {
    console.error("[getPlaylists]", err);
    return null;
  }
}

// ─── Minimal Spotify types ───────────────────────────────────────────────────

interface SpotifyImage {
  url: string;
  width: number | null;
  height: number | null;
}

interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  artists: { name: string }[];
  album: { images: SpotifyImage[] };
  external_urls: { spotify: string };
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  images: SpotifyImage[] | null;
  external_urls: { spotify: string };
}
