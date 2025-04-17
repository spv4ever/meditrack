// routes/medicationLogRoutes.js

const express = require('express');
const router = express.Router();
const medicationLogController = require('../controllers/medicationLogController');

// Asegúrate de que todos los handlers sean funciones válidas
router.get('/users/:userId/logs', medicationLogController.getMedicationLogs); // Correcto
router.post('/users/:userId/logs', medicationLogController.createMedicationLog); // Correcto

module.exports = router;
