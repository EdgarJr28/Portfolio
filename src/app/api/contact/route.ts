import { NextResponse } from 'next/server';
import transporter from '@/app/utils/Mailer';
import { Template } from '@/app/utils/templates/mailTemplate';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
