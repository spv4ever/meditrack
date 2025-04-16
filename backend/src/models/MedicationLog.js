const mongoose = require('mongoose');

const medicationLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  prescription: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription', required: true },
  scheduledTime: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' },
  confirmedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('MedicationLog', medicationLogSchema);
