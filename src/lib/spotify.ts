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

export async function getTopTracks(limit = 5, timeRange: "short_term" | "medium_term" | "long_term" = "medium_term") {
  await getAccessToken();
  try {
    const data = await spotifyApi.getMyTopTracks({ limit, time_range: timeRange });
    return data.body.items.map((track) => ({
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
    // Use client credentials so the API responds as a public visitor —
    // this returns only the playlists actually visible on the user's profile,
    // excluding any playlists the owner has hidden from their profile page.
    const guestApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });
    const cc = await guestApi.clientCredentialsGrant();
    guestApi.setAccessToken(cc.body.access_token);

    // Resolve owner ID via the authenticated user token first
    await getAccessToken();
    const me = await spotifyApi.getMe();

    const data = await guestApi.getUserPlaylists(me.body.id, { limit: 50 });
    return data.body.items.filter((p) => p.images?.[0]?.url);
  } catch (err) {
    console.error("[getPlaylists]", err);
    return null;
  }
}
