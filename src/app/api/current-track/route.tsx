import { getCurrentTrack, getLastPlayedTrack, getPlaybackState } from '@/app/utils/spotify';
import { NextResponse } from 'next/server';


// Maneja las solicitudes POST para obtener la canción actual
export async function POST(req: Request) {
    try {
        const track = await getCurrentTrack();
        const isPlaying = await getPlaybackState();
        const lastTrack = await getLastPlayedTrack()
        if (track) {
            return NextResponse.json({ track, isPlaying, lastTrack });
        } else {
            return NextResponse.json({ error: 'Error al obtener la canción actual' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error al obtener la canción actual:', error);
        return NextResponse.json({ error: 'Error al obtener la canción actual' }, { status: 500 });
    }
}

// Maneja las solicitudes OPTIONS para permitir CORS
export async function OPTIONS() {
    return NextResponse.json(null, {
        headers: {
            Allow: 'POST, OPTIONS',
        },
    });
}
