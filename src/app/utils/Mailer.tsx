import nodemailer from 'nodemailer';

// Configura el transporte de correo con Gmail
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,  // tu correo electrónico
        pass: process.env.EMAIL_PASSWORD  // tu contraseña
    }
});

export default transporter;
