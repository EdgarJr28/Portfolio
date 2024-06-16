import { NextResponse } from 'next/server';
import transporter from '@/app/utils/Mailer';
import { Template } from '@/app/utils/templates/mailTemplate';

export async function POST(req: Request) {
    try {
        const { email, name, message } = await req.json();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.TO_EMAIL_USER,
            subject: `New message from ${name} / contact me from my portfolio`,
            html: Template(email, name, message)
        };
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: 'Correo enviado correctamente' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return NextResponse.json({ error: 'Error al enviar el correo' }, { status: 500 });
    }
}

export async function OPTIONS() {
    return NextResponse.json(null, {
        headers: {
            Allow: 'POST, OPTIONS',
        },
    });
}
