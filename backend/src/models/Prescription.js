const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicationName: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: Number, // Número de veces al día
    required: true,
    min: [1, 'Debe tomarse al menos una vez al día']
  },
  intervaloHoras: {
    type: Number, // Cada cuántas horas
    required: true,
    min: [1, 'El intervalo debe ser al menos de una hora']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date, // Puede estar vacío si es medicación crónica
  },
  photoUrl: {
    type: String, // URL de la foto de la receta (opcional)
  },
  startHour: {
    type: String, // formato recomendado: "HH:mm"
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Validación personalizada antes de guardar
prescriptionSchema.pre('save', function (next) {
  if (this.frequency * this.intervaloHoras > 24) {
    return next(new Error('La combinación de frecuencia e intervalo no puede superar las 24 horas'));
  }
  next();
});

// Validación también para actualizaciones
prescriptionSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  const frequency = update.frequency ?? update.$set?.frequency;
  const intervaloHoras = update.intervaloHoras ?? update.$set?.intervaloHoras;

  if (frequency && intervaloHoras && frequency * intervaloHoras > 24) {
    return next(new Error('La combinación de frecuencia e intervalo no puede superar las 24 horas'));
  }
  next();
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
