const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const { TELEGRAM_API_URL, TELEGRAM_BOT_TOKEN } = process.env;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

// Configurar el webhook en tu servidor
const webhookURL = `${process.env.BASE_URL}/api/telegram/webhook`; // Este es el endpoint que manejará las actualizaciones

bot.setWebHook(webhookURL); // Establecer el webhook para tu bot

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

// Aquí manejas las respuestas automáticas cuando Telegram envíe una actualización a tu webhook
const handleUpdate = (update) => {
  const chatId = update.message.chat.id;
  const message = update.message.text;

  if (message === '/start') {
    const firstName = update.message.chat.first_name;
    sendMessageToTelegram(chatId, `¡Hola ${firstName}! Bienvenido a MediTrack.\nTu ID de Telegram es: ${chatId}`);
  } else if (message === '/myid') {
    sendMessageToTelegram(chatId, `Tu ID de Telegram es: ${chatId}`);
  }
};

// Establecer el handler para las actualizaciones
bot.on('message', handleUpdate);

module.exports = sendMessageToTelegram;
