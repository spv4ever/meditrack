const Prescription = require('../models/Prescription');
const asyncHandler = require('express-async-handler');

const verifyPrescriptionLimit = asyncHandler(async (req, res, next) => {
  const user = req.user;

  // Si el usuario es PRO o ADMIN, no tiene límites
  if (user.role === 'pro' || user.role === 'admin') {
    return next();
  }

  const prescription = await Prescription.findById(req.params.id);

  // Si no encontramos la receta (puede pasar en una creación POST, no importa)
  if (req.method !== 'POST' && !prescription) {
    res.status(404);
    throw new Error('Receta no encontrada');
  }

  // Si estamos desactivando una receta, no aplicar restricciones
  if (prescription && prescription.isActive === true) {
    return next();
  }

  // Verificación de recetas activas (solo para usuarios gratuitos)
  const activeCount = await Prescription.countDocuments({ user: user._id, isActive: true });

  if (activeCount >= 1) {
    res.status(403);
    throw new Error('Límite alcanzado: solo puedes tener 1 receta activa en la versión gratuita');
  }

  // Verificación de recetas totales (cuando se crea o reactiva)
  if (req.method === 'POST' || (req.method === 'PUT' && prescription && prescription.isActive === false)) {
    const totalCount = await Prescription.countDocuments({ user: user._id });
    if (totalCount >= 5) {
      res.status(403);
      throw new Error('Límite alcanzado: solo puedes tener 5 recetas en total');
    }
  }

  next();
});

module.exports = verifyPrescriptionLimit;
