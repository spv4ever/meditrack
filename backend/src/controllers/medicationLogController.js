// controllers/medicationLogController.js

const MedicationLog = require('../models/MedicationLog'); // Importar el modelo MedicationLog

// Obtener todos los logs de medicación de un usuario
const getMedicationLogs = async (req, res) => {
  try {
    const { userId } = req.params; // Obtener el userId desde los parámetros de la URL

    // Buscar los logs asociados con ese usuario
    const logs = await MedicationLog.find({ user: userId })
        .populate('prescription', 'medicationName') // 👈 Esto trae la descripción
        .sort({ scheduledTime: -1 }); // Ordenamos por fecha más reciente primero

    if (!logs || logs.length === 0) {
      return res.status(404).json({ message: 'No se encontraron logs de medicación.' });
    }

    return res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener los logs de medicación.' });
  }
};

// Guardar un nuevo log de medicación
const createMedicationLog = async (req, res) => {
  try {
    const { userId } = req.params; // Obtener el userId desde los parámetros de la URL
    const { message, timestamp } = req.body; // Los detalles del log

    // Crear un nuevo log de medicación
    const newLog = new MedicationLog({
      user: userId,
      message,
      timestamp,
    });

    await newLog.save();

    return res.status(201).json(newLog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al crear el log de medicación.' });
  }
};

// Otras funciones del controlador como actualizar o eliminar los logs pueden ir aquí

module.exports = {
  getMedicationLogs,
  createMedicationLog,
};
