import SpotifyWebApi from 'spotify-web-api-node';
import dotenv from 'dotenv';

dotenv.config();



const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    refreshToken: process.env.SPOTIFY_REFRESH_TOKEN,
});

async function getAccessToken() {
    try {
        const data = await spotifyApi.refreshAccessToken();
        spotifyApi.setAccessToken(data.body['access_token']);
    } catch (error) {
        console.error('Error refreshing access token:', error);
    }
}

export async function getCurrentTrack() {
    await getAccessToken();

    try {
        const data = await spotifyApi.getMyCurrentPlayingTrack();
        return data.body.item; // Retorna la información de la canción actual
    } catch (error: any) {
        console.error('Error getting current track:', error.message);
        return null;
    }
}

export async function getPlaybackState() {
    await getAccessToken();

    try {
        const data = await spotifyApi.getMyCurrentPlaybackState();
        return data.body.is_playing;
    } catch (error) {
        console.error('Error getting playback state:', error);
        return null;
    }
}

export async function getLastPlayedTrack() {
    try {
        const data = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 1 });
        const track = data.body.items[0].track;

        return track;
    } catch (err) {
        console.error('Algo salió mal al obtener la última canción reproducida:', err);
    }
};


