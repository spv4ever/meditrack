const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { protect } = require('./middleware/authMiddleware');
const userRoutes = require('./routes/userRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');

// Importar Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

// Endpoint protegido
app.get('/api/protected', protect, (req, res) => {
    res.json({ message: 'Acceso autorizado', user: req.user });
});

// Configuración de Swagger
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Documentación de la API del proyecto',
        },
        servers: [
            {
                url: `http://192.168.1.180:${process.env.PORT || 5000}`,
                description: 'Servidor local',
            },
        ],
    },
    apis: ['./routes/*.js'], // Archivos donde están definidos los endpoints
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});