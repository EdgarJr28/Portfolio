import { NextResponse } from "next/server";
import { getFolderImagesWithDates } from "@/lib/gallery";

export const dynamic = "force-dynamic";

/**
 * Todas mis fotos personales que ya se usan en la sección "Blog" (los
 * marcos flotantes del bosque 3D y el corazón detrás de la luna) — la
 * carpeta "Fotos" del mini-OS reutiliza este mismo origen, así que
 * agregar una foto nueva a esas carpetas la suma automáticamente acá
 * también, sin tocar código.
 */
export async function GET() {
  try {
    const photos = [
      ...getFolderImagesWithDates("images/randoms"),
      ...getFolderImagesWithDates("images/vibes"),
      ...getFolderImagesWithDates("images/nature"),
      ...getFolderImagesWithDates("easter/my_heart"),
    ];
    return NextResponse.json({ photos });
  } catch (err) {
    console.error("[/api/photos]", err);
    return NextResponse.json({ photos: [] });
  }
}
