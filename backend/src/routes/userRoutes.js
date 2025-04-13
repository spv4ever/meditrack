const express = require('express');
const router = express.Router();
const { sendTestMessage } = require('../controllers/userController');

// Ruta para enviar el mensaje de prueba
router.post('/send-test-message', sendTestMessage);

module.exports = router;
