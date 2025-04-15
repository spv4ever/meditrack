const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const { protect } = require('./middleware/authMiddleware');
const userRoutes = require('./routes/userRoutes');
const prescriptionRoutes = require('./routes/prescriptionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Telegram bot
const TelegramBot = require('node-telegram-bot-api');

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

dotenv.config();
connectDB();

const app = express();
const allowedOrigins = [
    'https://albertog103.sg-host.com',
    'http://192.168.1.180:3000'
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('No autorizado por CORS'));
      }
    },
    credentials: true
  }));

// app.options('*', cors()); // Permite preflight para cualquier ruta
app.use(express.json());

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/payments', paymentRoutes);


// Endpoint protegido de prueba
app.get('/api/protected', protect, (req, res) => {
    res.json({ message: 'Acceso autorizado', user: req.user });
});



// Configurar Swagger
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
    apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/* --------------------------------------------------------------------------
   CONFIGURACIÓN DEL BOT DE TELEGRAM CON WEBHOOK
-------------------------------------------------------------------------- */

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BASE_URL = process.env.BASE_URL; // ej. https://tu-app.onrender.com

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);
bot.setWebHook(`${BASE_URL}/api/telegram/webhook`);

app.post('/api/telegram/webhook', (req, res) => {
    bot.processUpdate(req.body); // Esto procesa automáticamente lo recibido
    res.sendStatus(200);
});

// Manejo de comandos
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const nombre = msg.from.first_name || 'usuario';

    await bot.sendMessage(chatId, `👋 ¡Hola ${nombre}!\nBienvenido a MediTrack.\n\nTu ID de Telegram es: ${chatId}\n\n🔁 Copia este número y pégalo en tu perfil de la app para recibir recordatorios.`);
});

bot.onText(/\/myid/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Tu ID de Telegram es: ${chatId}`);
});

// Middleware de manejo de errores global
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode || 500;
    res.status(statusCode).json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  app.use(errorHandler); // Usar el middleware de error después de todas las rutas

/* ---------------------------------------  ------------------------------ */

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
});
