const express = require('express');
const { registerUser, loginUser, updateUserProfile, forgotPassword, resetPassword } = require('../controllers/authController');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Ruta para registrar un nuevo usuario
router.post('/register', registerUser);

// Ruta para iniciar sesión
router.post('/login', loginUser);

// Ruta para actualizar perfil (protegida con JWT)
router.put('/profile', protect, updateUserProfile);

// Ruta para solicitar recuperación
router.post('/forgot-password', forgotPassword);

// Ruta para enviar nueva contraseña
router.post('/reset-password/:token', resetPassword);

module.exports = router;
