import { getPlaylist } from '@/app/utils/spotify';
import { NextResponse } from 'next/server';


// Maneja las solicitudes POST para obtener la canción actual
export async function POST(req: Request) {
    try {
        const Playlists = await getPlaylist();

        if (Playlists) {
            return NextResponse.json({ Playlists });
        } else {
            return null
        }
    } catch (error) {
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
