const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const sendEmail = require('../services/sendEmail');
const crypto = require('crypto'); // ✅ Para generar el token
const dotenv = require('dotenv');
dotenv.config();
// =========================
// Registro de usuario
// =========================
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, telegramId, telegramToken } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('El usuario ya existe');
  }

  const user = await User.create({ email, password, telegramId, telegramToken });

  if (user) {
    const subject = '¡Bienvenido a MediTrack! 🩺';
    const html = `
      <h2>Hola 👋</h2>
      <p>Gracias por registrarte en <strong>MediTrack</strong>.</p>
      <p>Para recibir notificaciones sobre tus tomas de medicación, sigue estos pasos:</p>
      <ol>
        <li>Únete a nuestro canal de Telegram: <a href="https://t.me/tu_canal_bot" target="_blank">t.me/tu_canal_bot</a></li>
        <li>Abre el bot y pulsa en "Start".</li>
        <li>Copia tu <strong>Telegram ID</strong> y pégalo en tu perfil de MediTrack.</li>
        <li>¡Listo! Empezarás a recibir recordatorios.</li>
      </ol>
      <p>Si tienes dudas, puedes responder a este correo.</p>
      <p>Gracias por usar MediTrack 🧠💊</p>
    `;

    try {
      await sendEmail(email, subject, html);
    } catch (error) {
      console.error('Error enviando el email de bienvenida:', error.message);
    }

    res.status(201).json({
      id: user._id,
      email: user.email,
      telegramId: user.telegramId,
      token: user.generateAuthToken(),
    });
  } else {
    res.status(400);
    throw new Error('No se pudo crear el usuario');
  }
});

// =========================
// Login
// =========================
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error('Usuario no encontrado');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(400);
    throw new Error('Contraseña incorrecta');
  }

  res.json({
    id: user._id,
    email: user.email,
    telegramId: user.telegramId,
    nombre: user.nombre,
    apellidos: user.apellidos,
    role: user.role,
    token: user.generateAuthToken(),
  });
});

// =========================
// Actualizar perfil
// =========================
const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { nombre, apellidos, telegramId } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }

  if (nombre !== undefined) user.nombre = nombre;
  if (apellidos !== undefined) user.apellidos = apellidos;
  if (telegramId !== undefined) user.telegramId = telegramId;

  const updatedUser = await user.save();

  res.json({
    id: updatedUser._id,
    email: updatedUser.email,
    nombre: updatedUser.nombre,
    apellidos: updatedUser.apellidos,
    telegramId: updatedUser.telegramId,
    role: updatedUser.role,
    token: updatedUser.generateAuthToken(),
  });
});

// =========================
// Recuperar contraseña
// =========================
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }

  const token = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1h

  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const html = `
    <h2>Restablecer contraseña</h2>
    <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>Este enlace expirará en 1 hora.</p>
  `;

  await sendEmail(user.email, 'Recuperar contraseña', html);

  res.json({ message: 'Se ha enviado un correo con instrucciones para restablecer tu contraseña.' });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error('Token inválido o expirado');
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.json({ message: 'Contraseña restablecida correctamente.' });
});

module.exports = {
  registerUser,
  loginUser,
  updateUserProfile,
  forgotPassword,
  resetPassword,
};
