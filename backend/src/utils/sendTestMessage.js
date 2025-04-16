const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const { TELEGRAM_API_URL, TELEGRAM_BOT_TOKEN } = process.env;

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false });

// Configurar el webhook en tu servidor
const webhookURL = `${process.env.BASE_URL}/api/telegram/webhook`; // Este es el endpoint que manejará las actualizaciones

bot.setWebHook(webhookURL); // Establecer el webhook para tu bot

// Función para enviar mensajes a Telegram usando axios
const sendMessageToTelegram = async (chatId, message, options = {}) => {
    const url = `${TELEGRAM_API_URL}/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    try {
      const response = await axios.post(url, {
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown', // Esto permite el formato en negrita, etc.
        ...options // Aquí se incluyen reply_markup y otros parámetros si los hay
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error al enviar mensaje a Telegram:", error.response?.data || error.message);
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

// bot.on('callback_query', async (callbackQuery) => {
//     const { data, from, message } = callbackQuery;
  
//     console.log(`📥 Callback recibido de ${from.username || from.first_name}: ${data}`);
  
//     // Opcional: Responder a Telegram para cerrar el loader del botón
//     await bot.answerCallbackQuery(callbackQuery.id, {
//       text: '✅ Toma confirmada',
//       show_alert: false // Puedes poner true si quieres que sea una ventana emergente
//     });
  
//     // Opcional: Enviar un mensaje de confirmación al usuario
//     await bot.sendMessage(callbackQuery.from.id, 'Gracias por confirmar la toma de tu medicación.');
//   });

module.exports = sendMessageToTelegram;
