const Prescription = require('../models/Prescription');
const asyncHandler = require('express-async-handler');

// Obtener todas las recetas del usuario
const getPrescriptions = asyncHandler(async (req, res) => {
  const prescriptions = await Prescription.find({ user: req.user.id });
  res.json(prescriptions);
});

// Crear una nueva receta
const createPrescription = asyncHandler(async (req, res) => {
  const { medicationName, dosage, frequency, startDate, endDate, photoUrl, startHour, intervaloHoras } = req.body;

  if (!medicationName || !dosage || !frequency || !startDate) {
    res.status(400);
    throw new Error('Faltan datos obligatorios');
  }

  const user = req.user;

  // Solo limitar si el usuario es free
  if (user.role === 'free') {
    const totalPrescriptions = await Prescription.countDocuments({ user: user.id });
    const activePrescriptions = await Prescription.countDocuments({ user: user.id, isActive: true });

    if (totalPrescriptions >= 5) {
      res.status(403);
      throw new Error('Límite de 5 recetas alcanzado para usuarios gratuitos');
    }

    if (activePrescriptions >= 1) {
      res.status(403);
      throw new Error('Solo puedes tener 1 receta activa en la versión gratuita');
    }
  }

  const prescription = await Prescription.create({
    user: user.id,
    medicationName,
    dosage,
    frequency,
    startDate,
    startHour,
    intervaloHoras,
    endDate: endDate || null,
    photoUrl
  });

  res.status(201).json(prescription);
});

// Activar/Inactivar receta
const togglePrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);

  if (!prescription || prescription.user.toString() !== req.user.id) {
    res.status(404);
    throw new Error('Receta no encontrada');
  }

  prescription.isActive = !prescription.isActive;
  await prescription.save();
  res.json({ message: `Receta ${prescription.isActive ? 'activada' : 'desactivada'}` });
});

// Eliminar receta
const deletePrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);

  if (!prescription) {
    res.status(404);
    throw new Error('Receta no encontrada');
  }

  if (prescription.user.toString() !== req.user.id) {
    res.status(403);
    throw new Error('No tienes permiso para eliminar esta receta');
  }

  await prescription.deleteOne();

  res.status(200).json({ message: 'Receta eliminada' });
});

const updatePrescription = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
  
      const updated = await Prescription.findByIdAndUpdate(id, updatedData, {
        new: true, // Devuelve la receta actualizada
        runValidators: true, // Aplica validaciones del schema
      });
  
      if (!updated) {
        return res.status(404).json({ message: 'Receta no encontrada' });
      }
  
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al actualizar la receta' });
    }
  };

module.exports = {
  getPrescriptions,
  createPrescription,
  togglePrescription,
  deletePrescription,
  updatePrescription
};
