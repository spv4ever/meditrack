const express = require('express');
const router = express.Router();
const {
  getPrescriptions,
  createPrescription,
  togglePrescription,
  deletePrescription,
  updatePrescription
} = require('../controllers/prescriptionController');
const { protect } = require('../middleware/authMiddleware');
const verifyPrescriptionLimit = require('../middleware/verifyPrescriptionLimit');

// Rutas protegidas
router.route('/')
  .get(protect, getPrescriptions)
  .post(protect, createPrescription);

router.route('/:id/toggle')
  .patch(protect, verifyPrescriptionLimit, togglePrescription);

router.route('/:id')
  .delete(protect, deletePrescription);

router.post('/', protect, verifyPrescriptionLimit, createPrescription);

router.patch('/:id', protect, updatePrescription);

module.exports = router;
