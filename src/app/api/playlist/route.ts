import { NextResponse } from "next/server";
import { getPlaylists } from "@/lib/spotify";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const playlists = await getPlaylists();
    if (!playlists) return NextResponse.json(null);

    return NextResponse.json({
      ownerName: playlists[0]?.owner?.display_name ?? "",
      playlists: playlists.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description ?? "",
        image: p.images?.[0]?.url ?? "",
        url: p.external_urls?.spotify ?? "",
        trackCount: p.tracks?.total ?? 0,
      })),
    });
  } catch (err) {
    console.error("[/api/playlist]", err);
    return NextResponse.json(null);
  }
}
