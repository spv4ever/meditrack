const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Middleware para verificar el token JWT
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decodificamos el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscamos al usuario por el ID
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401);
      throw new Error('No autorizado, token inválido');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('No autorizado, no se encontró token');
  }
});

const admin = async (req, res, next) => {
    const userId = req.user.id;
  
    try {
      const user = await User.findById(userId);
      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado, solo administradores pueden realizar esta acción' });
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al verificar el rol del usuario' });
    }
  };

module.exports = { protect, admin };
