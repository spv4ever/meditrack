const axios = require('axios');

// Función para enviar el mensaje a Telegram
const sendTelegramMessage = async (chatId, message) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const data = {
    chat_id: chatId,
    text: message,
  };

  try {
    await axios.post(url, data);
    console.log('Mensaje enviado a Telegram');
  } catch (error) {
    console.error('Error al enviar el mensaje a Telegram:', error);
  }
};

// Ejemplo de cómo obtener el chat_id del usuario (suponiendo que esté en la base de datos)
const user = await User.findById(userId); // Busca al usuario por su ID
const chatId = user.telegramId; // Usamos el `telegramId` almacenado en la base de datos

// Llamamos a la función para enviar el mensaje
sendTelegramMessage(chatId, 'Recordatorio: Hora de tomar tu medicamento');
