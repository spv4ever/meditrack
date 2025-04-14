const User = require('../models/User');
const asyncHandler = require('express-async-handler');  // Para manejar errores asíncronos
const jwt = require('jsonwebtoken');
const sendEmail = require('../services/sendEmail'); // ✅ importación correcta

// 

const registerUser = asyncHandler(async (req, res) => {
    const { email, password, telegramId, telegramToken } = req.body;
  
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('El usuario ya existe');
    }
  
    const user = await User.create({ email, password, telegramId, telegramToken });
  
    if (user) {
      // ✅ Enviamos el correo de bienvenida
      const subject = '¡Bienvenido a MediTrack! 🩺';
      const html = `
        <h2>Hola 👋</h2>
        <p>Gracias por registrarte en <strong>MediTrack</strong>.</p>
        <p>Para recibir notificaciones sobre tus tomas de medicación, sigue estos pasos:</p>
        <ol>
          <li>Únete a nuestro canal de Telegram haciendo clic aquí: <a href="https://t.me/tu_canal_bot" target="_blank">t.me/tu_canal_bot</a></li>
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
        // No detenemos el registro si falla el correo
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

// Iniciar sesión de usuario
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Comprobamos si el usuario existe
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error('Usuario no encontrado');
  }

  // Comprobamos la contraseña
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

// Actualizar datos del perfil del usuario
const updateUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id; // Lo extraemos del middleware de autenticación
    const { nombre, apellidos, telegramId } = req.body;
  
    const user = await User.findById(userId);
    if (!user) {
      res.status(404);
      throw new Error('Usuario no encontrado');
    }
  
    // Solo actualizamos los campos permitidos
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
      token: updatedUser.generateAuthToken(), // Por si quieres refrescar el token
    });
  });

module.exports = {
  registerUser,
  loginUser,
  updateUserProfile,
};
