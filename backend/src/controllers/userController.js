const sendMessageToTelegram = require('../utils/sendTestMessage');

const sendTestMessage = async (req, res) => {
    const { chatId, text } = req.body;
  
    if (!chatId) {
      return res.status(400).json({ message: 'El chatId es necesario' });
    }
  
    try {
      // Intentamos enviar el mensaje
      await sendMessageToTelegram(chatId, text);
      return res.status(200).json({ message: 'Mensaje de prueba enviado correctamente.' });
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);  // Añadido para más detalles
      return res.status(500).json({ message: 'Hubo un error al enviar el mensaje', error: error.message });
    }
  };

module.exports = {
  sendTestMessage
};
