import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

export const dynamic = "force-dynamic";

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  // Igualamos longitudes antes de comparar para no filtrar por timing si
  // difieren, y para que timingSafeEqual no tire por buffers de tamaño
  // distinto.
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export async function POST(req: Request) {
  try {
    const { password } = (await req.json()) as { password?: unknown };
    const expected = process.env.PRIVATE_FOLDER_PASSWORD;
    if (!expected) {
      console.error("[private-folder/verify] falta configurar PRIVATE_FOLDER_PASSWORD");
      return NextResponse.json({ ok: false }, { status: 500 });
    }
    const ok = typeof password === "string" && password.length > 0 && safeCompare(password, expected);
    return NextResponse.json({ ok });
  } catch (err) {
    console.error("[private-folder/verify]", err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
