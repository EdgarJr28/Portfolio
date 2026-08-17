import { NextResponse } from "next/server";
import { getTopTracks } from "@/lib/spotify";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const tracks = await getTopTracks(5, "medium_term");
    return NextResponse.json({ tracks });
  } catch (err) {
    console.error("[/api/spotify/top-tracks]", err);
    return NextResponse.json({ tracks: [] });
  }
}
