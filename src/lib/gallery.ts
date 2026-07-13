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

export interface PhotoWithDate {
  src: string;
  /** Fecha del archivo (creación si el filesystem la expone, si no modificación), ISO. */
  date: string;
}

/** Igual que getFolderImages, pero suma la fecha del archivo (para mostrarla en el visor). */
export function getFolderImagesWithDates(relativeDir: string): PhotoWithDate[] {
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
    .map((f) => {
      const stat = fs.statSync(path.join(dir, f));
      const date = stat.birthtime.getTime() > 0 ? stat.birthtime : stat.mtime;
      return { src: `/${relativeDir}/${f}`, date: date.toISOString() };
    });
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
