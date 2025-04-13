const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const { TELEGRAM_API_URL, TELEGRAM_BOT_TOKEN } = process.env;

// Crear una instancia del bot con el token
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// Función para enviar mensajes a Telegram usando axios
const sendMessageToTelegram = async (chatId, message) => {
  const url = `${TELEGRAM_API_URL}/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    const response = await axios.post(url, {
      chat_id: chatId,
      text: message
    });
    return response.data;
  } catch (error) {
    console.error("Error al enviar mensaje a Telegram:", error);
    throw new Error("No se pudo enviar el mensaje a Telegram");
  }
};

// Comando /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.chat.first_name;

  // Enviar mensaje de bienvenida con el ID de Telegram
  const welcomeMessage = `¡Hola ${firstName}! Bienvenido a MediTrack.\nTu ID de Telegram es: ${chatId}`;
  sendMessageToTelegram(chatId, welcomeMessage);
});

// Comando /myid
bot.onText(/\/myid/, (msg) => {
  const chatId = msg.chat.id;
  // Enviar el ID de Telegram del usuario
  sendMessageToTelegram(chatId, `Tu ID de Telegram es: ${chatId}`);
});

// Exportar para que se pueda usar en otros archivos
module.exports = sendMessageToTelegram;
