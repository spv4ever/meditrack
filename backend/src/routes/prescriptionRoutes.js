const express = require('express');
const router = express.Router();
const Prescription = require("../models/Prescription");
const { uploadPhoto: multerUploadPhoto } = require("../middleware/multerMiddleware");
const upload = require("../utils/multer");
const {
  getPrescriptions,
  createPrescription,
  togglePrescription,
  deletePrescription,
  updatePrescription,
  uploadPhoto
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

// Subir foto para una receta existente
router.put("/photo/:id", multerUploadPhoto, uploadPhoto); // Usamos el controlador para manejar la subida

module.exports = router;
