import fs from "node:fs";
import path from "node:path";

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
]);

/**
 * Lee todas las imágenes dentro de `public/<relativeDir>` y devuelve sus
 * rutas públicas, ordenadas alfabéticamente. Corre en el servidor (build o
 * request time) — para sumar fotos nuevas solo hay que soltarlas en la
 * carpeta, sin tocar código.
 */
export function getFolderImages(relativeDir: string): string[] {
  const dir = path.join(process.cwd(), "public", relativeDir);
  let entries: string[];
  try {
    entries = fs.readdirSync(dir);
  } catch {
    return [];
  }
  return entries
    .filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b))
    .map((f) => `/${relativeDir}/${f}`);
}

/** Mueve el archivo indicado al frente de la lista (portada), si existe. */
export function withCoverFirst(photos: string[], coverFilename: string): string[] {
  const idx = photos.findIndex((p) => p.endsWith(`/${coverFilename}`));
  if (idx <= 0) return photos;
  const copy = [...photos];
  const [cover] = copy.splice(idx, 1);
  copy.unshift(cover);
  return copy;
}
