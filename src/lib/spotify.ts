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
    return data.body.item ?? null;
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
