const axios = require('axios');
require('dotenv').config();
const { TELEGRAM_API_URL, TELEGRAM_BOT_TOKEN } = process.env;

const sendMessageToTelegram = async (chatId, message) => {
//   console.log('TELEGRAM_API_URL:', TELEGRAM_API_URL);
//   console.log('TELEGRAM_BOT_TOKEN:', TELEGRAM_BOT_TOKEN);
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

module.exports = sendMessageToTelegram;
