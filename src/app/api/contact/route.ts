import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildEmailHtml(name: string, email: string, message: string) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#0f0f0f;color:#f0f0f0;border-radius:8px;">
      <p style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(240,240,240,0.5);margin:0 0 20px;">
        Nuevo mensaje desde el portfolio
      </p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="padding:6px 0;color:rgba(240,240,240,0.5);width:80px;font-size:13px;">Nombre</td>
          <td style="padding:6px 0;font-weight:600;font-size:14px;">${safeName}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:rgba(240,240,240,0.5);font-size:13px;">Email</td>
          <td style="padding:6px 0;font-size:14px;">
            <a href="mailto:${safeEmail}" style="color:#f0f0f0;">${safeEmail}</a>
          </td>
        </tr>
      </table>
      <hr style="border:none;border-top:1px solid rgba(255,255,255,0.12);margin:0 0 20px;" />
      <p style="white-space:pre-wrap;line-height:1.6;font-size:14px;margin:0 0 24px;">${safeMessage}</p>
      <p style="font-size:11px;color:rgba(240,240,240,0.35);margin:0;">EdDev — ed.dev28@gmail.com</p>
    </div>
  `;
}

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "El email no es válido" },
        { status: 400 }
      );
    }

    await transporter.sendMail({
      from: `"Portfolio" <${process.env.EMAIL_USER}>`,
      to: process.env.TO_EMAIL_USER,
      replyTo: email,
      subject: `Nuevo mensaje de ${name} — portfolio`,
      html: buildEmailHtml(name, email, message),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/contact]", err);
    return NextResponse.json(
      { error: "Error al enviar el mensaje" },
      { status: 500 }
    );
  }
}
