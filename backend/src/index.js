const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { protect } = require('./middleware/authMiddleware');
const userRoutes = require('./routes/userRoutes'); // Asegúrate de importar las rutas del usuario


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

// Usar las rutas de usuario
app.use('/api/users', userRoutes);

app.get('/api/protected', protect, (req, res) => {
    res.json({ message: 'Acceso autorizado', user: req.user });
  });

const prescriptionRoutes = require('./routes/prescriptionRoutes');
app.use('/api/prescriptions', prescriptionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
  });
