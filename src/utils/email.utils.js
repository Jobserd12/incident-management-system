import nodemailer from 'nodemailer';
import config from '../config/config.js';

const transporter = nodemailer.createTransport({
  host: config.auth.email.host,
  port: config.auth.email.port,
  auth: {
    user: config.auth.email.user,
    pass: config.auth.email.pass
  }
});

const buttonStyles = `
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  margin: 10px 0;
`;

export const sendVerificationEmail = async (user, verificationToken) => {
  try {
    const verificationUrl = `${config.baseUrl}/auth/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: 'Incident System <mailtrap@incidents.com>',
      to: user.email,
      subject: 'Verifica tu cuenta',
      html: `
        <h1>Bienvenido al Sistema de Gestión de Incidentes</h1>
        <p>Por favor, verifica tu cuenta haciendo clic en el siguiente enlace:</p>
        <a href="${verificationUrl}" style="${buttonStyles}">
          Verificar cuenta
        </a>
        <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>
        <p>El enlace expirará en 24 horas.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
};

export const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    const resetUrl = `${config.baseUrl}/auth/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: 'Incident System <mailtrap@incidents.com>',
      to: user.email,
      subject: 'Recuperación de Contraseña',
      html: `
        <h1>Recuperación de Contraseña</h1>
        <p>Has solicitado restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <a href="${resetUrl}" style="${buttonStyles}">
          Restablecer Contraseña
        </a>
        <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
        <p>El enlace expirará en 1 hora.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
}; 