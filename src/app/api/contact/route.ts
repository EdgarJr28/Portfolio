import { NextResponse } from 'next/server';
import transporter from '@/app/utils/Mailer';
import { Template } from '@/app/utils/templates/mailTemplate';
import { rateLimit, clientIp } from '@/app/utils/rateLimit';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort: 5 sends per 10 minutes per IP. Protects the Gmail quota/inbox
// from casual flooding; not a hard guarantee on serverless (see rateLimit.ts).
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

async function verifyCaptcha(token: string): Promise<boolean> {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) return false;
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secret}&response=${token}`,
    });
    const data = await res.json();
    return data.success === true;
}

export async function POST(req: Request) {
    try {
        const limit = rateLimit(clientIp(req), RATE_LIMIT, RATE_WINDOW_MS);
        if (!limit.ok) {
            return NextResponse.json(
                { error: 'Demasiados intentos. Intenta de nuevo más tarde.' },
                { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
            );
        }

        const { name, email, message, captchaToken } = await req.json();

        if (
            typeof name !== 'string' ||
            typeof email !== 'string' ||
            typeof message !== 'string' ||
            !name.trim() ||
            !email.trim() ||
            !message.trim()
        ) {
            return NextResponse.json(
                { error: 'Todos los campos son requeridos' },
                { status: 400 }
            );
        }

        if (!EMAIL_RE.test(email)) {
            return NextResponse.json(
                { error: 'El email no es válido' },
                { status: 400 }
            );
        }

        if (!captchaToken || !(await verifyCaptcha(captchaToken))) {
            return NextResponse.json(
                { error: 'Verificación de captcha fallida' },
                { status: 400 }
            );
        }

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.TO_EMAIL_USER,
            subject: `New message from ${name} / contact me from my portfolio`,
            html: Template(name, email, message),
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error('[/api/contact]', err);
        return NextResponse.json(
            { error: 'Error al enviar el mensaje' },
            { status: 500 }
        );
    }
}

export async function OPTIONS() {
    return NextResponse.json(null, {
        headers: { Allow: 'POST, OPTIONS' },
    });
}
