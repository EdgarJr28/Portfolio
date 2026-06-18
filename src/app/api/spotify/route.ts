import { NextResponse } from "next/server";
import {
  getCurrentTrack,
  getLastPlayedTrack,
  getPlaybackState,
} from "@/lib/spotify";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const [track, isPlaying, lastTrack] = await Promise.all([
      getCurrentTrack(),
      getPlaybackState(),
      getLastPlayedTrack(),
    ]);

    // Usar pista activa si está reproduciendo, si no la última reproducida
    const source = isPlaying && track ? track : lastTrack;
    if (!source) return NextResponse.json(null);

    const isTrack = (source as { type?: string }).type === "track";
    const albumImage: string = isTrack
      ? (source as { album: { images: { url: string }[] } }).album?.images[0]?.url ?? ""
      : (source as { show: { images: { url: string }[] } }).show?.images[0]?.url ?? "";

    const title: string = isTrack
      ? (source as { name: string }).name
      : (source as { show: { name: string } }).show?.name ?? "";

    const artist: string = isTrack
      ? (source as { artists: { name: string }[] }).artists?.[0]?.name ?? ""
      : (source as { show: { publisher: string } }).show?.publisher ?? "";

    const songUrl: string =
      (source as { external_urls?: { spotify?: string } }).external_urls
        ?.spotify ?? "";

    return NextResponse.json({
      isPlaying: !!(isPlaying && track),
      title,
      artist,
      albumImage,
      songUrl,
    });
  } catch (err) {
    console.error("[/api/spotify]", err);
    return NextResponse.json(null);
  }
}
