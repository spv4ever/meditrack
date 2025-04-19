const MedicationLog = require('../models/MedicationLog');
const Prescription = require('../models/Prescription');
const User = require('../models/User');
const Contact = require('../models/Contact');
const sendEmail = require('../services/sendEmail');
const sendMessageToTelegram = require('../utils/sendTestMessage');

const verificarLogsNoConfirmados = async () => {
  const ahora = new Date();
  const hace30Min = new Date(ahora.getTime() - 30 * 60 * 1000);

  try {
    const logs = await MedicationLog.find({
      status: 'pending',
      confirmedAt: { $exists: false },
      scheduledTime: { $lt: hace30Min },
      wasNotified: { $ne: true }, // Aún no se ha notificado
    })
    .populate('user')
    .populate('prescription');

    for (const log of logs) {
      const usuario = log.user;
      const medicamento = log.prescription.medicationName || 'una medicación';
      const fecha = log.scheduledTime.toLocaleString();

      const contactos = await Contact.find({ user: usuario._id });

      for (const contacto of contactos) {
        const mensaje = `
          Hola ${contacto.name || 'contacto'}, 

          ${usuario.name || 'El usuario'} no ha confirmado la toma de su medicación *${medicamento}*, programada para las *${fecha}*.

          Este aviso es automático por si deseas contactarle o comprobar que se encuentra bien.

          — Equipo MediTrack
        `;

        // Email
        if (contacto.email) {
          await sendEmail(
            contacto.email,
            `⚠️ Alerta: ${usuario.name || 'un usuario'} no confirmó su medicación`,
            `<p>${mensaje.replace(/\n/g, '<br>')}</p>`
          );
          console.log(`📧 Email enviado a ${contacto.email}`);
        }

        // Telegram
        if (contacto.telegramId) {
          await sendMessageToTelegram(contacto.telegramId, mensaje, { parse_mode: 'Markdown' });
          console.log(`📨 Telegram enviado a ${contacto.telegramId}`);
        }
      }

      // Marca como notificado para evitar reenvíos
      log.wasNotified = true;
      await log.save();
    }

  } catch (error) {
    console.error('❌ Error en la verificación de logs no confirmados:', error);
  }
};

// Cada 5 minutos
setInterval(verificarLogsNoConfirmados, 5 * 60 * 1000);

module.exports = verificarLogsNoConfirmados;
