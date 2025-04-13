const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const Payment = require('../models/Payment');

// Ruta para registrar un pago
router.post('/', protect, admin, async (req, res) => {
  const { user, method, amount, startDate, endDate, transactionId, notes } = req.body;

  // Validación de los campos requeridos
  if (!user || !method || !amount || !startDate || !endDate) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    // Creamos un nuevo registro de pago
    const payment = new Payment({
      user,
      method,
      amount,
      startDate,
      endDate,
      transactionId,
      notes
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el pago' });
  }
});

module.exports = router;
