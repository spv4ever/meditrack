const User = require('../models/User');
const asyncHandler = require('express-async-handler');  // Para manejar errores asíncronos
const jwt = require('jsonwebtoken');

// Registrar nuevo usuario
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, telegramId, telegramToken } = req.body;

  // Comprobamos si el usuario ya existe
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('El usuario ya existe');
  }

  // Creamos el nuevo usuario
  const user = await User.create({ email, password, telegramId, telegramToken });

  if (user) {
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
