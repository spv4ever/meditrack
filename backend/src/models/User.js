const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');  // Para encriptar contraseñas
const jwt = require('jsonwebtoken'); // Para la creación de JWT

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  nombre: {
    type: String,
    default: ''
  },
  apellidos: {
    type: String,
    default: ''
  },
  telegramId: {
    type: String,
    //unique: true,  // Puede ser único si decides tener un solo telegramId por usuario
    sparse: true,  // Permite que el campo sea opcional en algunos casos (por ejemplo, si aún no lo han conectado)
  },
  telegramUsername: {
    type: String,
    sparse: true,  // Opcional
  },

  telegramToken: {
    type: String,
    sparse: true,  // También es opcional hasta que el usuario lo conecte
  },
  role: {
    type: String,
    enum: ['free', 'pro', 'admin'],
    default: 'pro',
  },
  proUntil: {
    type: Date,
    default: () => new Date('2025-06-30T23:59:59.999Z'),
  },
  
}, { timestamps: true });

// Método para encriptar la contraseña antes de guardarla
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
  
//   // Encriptamos la contraseña con un salt de 10 rondas
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

userSchema.pre('save', async function(next) {
    // Si la contraseña fue modificada, la encriptamos
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  
    // Si el usuario tenía una fecha pro, y ya pasó, lo bajamos a 'free'
    if (this.proUntil && new Date() > this.proUntil) {
      this.role = 'free';
    }
  
    next();
  });

// Método para comparar la contraseña al iniciar sesión
userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Método para generar un token JWT
userSchema.methods.generateAuthToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

module.exports = mongoose.model('User', userSchema);
