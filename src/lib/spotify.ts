import SpotifyWebApi from "spotify-web-api-node";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  refreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
});

async function getAccessToken() {
  const data = await spotifyApi.refreshAccessToken();
  spotifyApi.setAccessToken(data.body.access_token);
}

export async function getCurrentTrack() {
  await getAccessToken();
  try {
    const data = await spotifyApi.getMyCurrentPlayingTrack({
      additional_types: "track,episode",
    } as Parameters<typeof spotifyApi.getMyCurrentPlayingTrack>[0]);
    if (!data.body.item) return null;
    return { ...data.body.item, progress_ms: data.body.progress_ms ?? 0 };
  } catch {
    return null;
  }
}

export async function getPlaybackState(): Promise<boolean> {
  await getAccessToken();
  try {
    const data = await spotifyApi.getMyCurrentPlaybackState();
    return data.body.is_playing ?? false;
  } catch {
    return false;
  }
}

export async function getLastPlayedTrack() {
  await getAccessToken();
  try {
    const data = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 1 });
    return data.body.items[0]?.track ?? null;
  } catch {
    return null;
  }
}

export async function getRecentlyPlayedTracks(limit = 10) {
  await getAccessToken();
  try {
    const data = await spotifyApi.getMyRecentlyPlayedTracks({ limit });
    // La misma canción puede aparecer varias veces en el historial reciente
    // (repetida en loop, etc.) — nos quedamos con la primera aparición.
    const seen = new Set<string>();
    const tracks = [];
    for (const item of data.body.items) {
      const track = item.track;
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

export async function getPlaylists() {
  await getAccessToken();
  try {
    const me = await spotifyApi.getMe();
    const data = await spotifyApi.getUserPlaylists(me.body.id, { limit: 12 });
    return data.body.items.filter((p) => p.images?.[0]?.url);
  } catch (err) {
    console.error("[getPlaylists]", err);
    return null;
  }
}
