import { NextResponse } from "next/server";
import { getRecentlyPlayedTracks } from "@/lib/spotify";
import { getITunesPreview } from "@/lib/itunesPreview";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const tracks = await getRecentlyPlayedTracks(10);
    const withPreviews = await Promise.all(
      tracks.map(async (t) => {
        const artist = t.artists?.[0]?.name ?? "";
        // Spotify no siempre da preview_url — si falta, probamos con la
        // iTunes Search API como respaldo (ver src/lib/itunesPreview.ts).
        const previewUrl = t.preview_url ?? (await getITunesPreview(artist, t.name));
        return {
          id: t.id,
          title: t.name,
          artist,
          album: t.album?.name ?? "",
          albumImage: t.album?.images?.[0]?.url ?? "",
          previewUrl,
          songUrl: t.external_urls?.spotify ?? "",
          durationMs: t.duration_ms ?? 0,
        };
      })
    );
    return NextResponse.json({ tracks: withPreviews });
  } catch (err) {
    console.error("[/api/spotify/recent]", err);
    return NextResponse.json({ tracks: [] });
  }
}
