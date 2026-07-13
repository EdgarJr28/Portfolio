/**
 * Respaldo de previews cuando Spotify no da preview_url (algo común desde
 * nov. 2024 para buena parte del catálogo, según la app). La iTunes Search
 * API de Apple es pública, gratuita, no requiere API key ni login, y está
 * pensada justamente para esto: devuelve un preview de ~30s por canción.
 * https://performance-partners.apple.com/search-api
 */
export async function getITunesPreview(
  artist: string,
  title: string
): Promise<string | null> {
  try {
    const term = encodeURIComponent(`${artist} ${title}`);
    const res = await fetch(
      `https://itunes.apple.com/search?term=${term}&entity=song&limit=1`,
      { signal: AbortSignal.timeout(4000) }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { results?: { previewUrl?: string }[] };
    return data.results?.[0]?.previewUrl ?? null;
  } catch (err) {
    console.error("[getITunesPreview]", err);
    return null;
  }
}
