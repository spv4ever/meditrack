// const cron = require('node-cron');
// const moment = require('moment'); // asegúrate de tener moment instalado

// console.log('✅ cronJob.js cargado');

// cron.schedule('* * * * *', () => {
//   const now = moment().format('HH:mm:ss');
//   console.log(`⏰ Cron ejecutado a las ${now}`);
// });


// jobs/cronJob.js
const sendMessageToTelegram = require('../utils/sendTestMessage'); // Asegúrate de usar la ruta correcta a tu archivo
const cron = require('node-cron');
const Prescription = require('../models/Prescription');
const User = require('../models/User');
const TelegramBot = require('node-telegram-bot-api');
//const moment = require('moment');
const moment = require('moment-timezone');
const MedicationLog = require('../models/MedicationLog'); // Asegúrate de tener la ruta correcta

require('dotenv').config();

console.log('✅ cronJob.js cargado');

//const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);



function calcularTomasDiarias(startHour, intervalo, frequency) {
  const horas = [];
  const [startH, startM] = startHour.split(':').map(Number);
  const start = moment.tz({ hour: startH, minute: startM, second: 0 }, 'Europe/Madrid');//moment().set({ hour: startH, minute: startM, second: 0, millisecond: 0 });

  for (let i = 0; i < frequency; i++) {
    horas.push(start.clone().add(i * intervalo, 'hours').format('HH:mm'));
  }

  return horas;
}

const enviarRecordatorio = async () => {
    console.log('⏰ Ejecutando cron...');
    
    const prescriptions = await Prescription.find({ isActive: true }).populate('user');
    console.log(`🧾 Prescripciones activas encontradas: ${prescriptions.length}`);

    // prescriptions.forEach(p => {
    //     console.log(`👤 Usuario de la receta ${p.medicationName}:`, p.user);
    //   });
  
    const horaActual = moment().tz('Europe/Madrid').format('HH:mm');
    console.log(`🕒 Hora actual: ${horaActual}`);

    prescriptions.forEach(async pres => {
    if (!pres.user?.telegramId) {
        console.log(`⚠️ Usuario sin telegramId, saltando: ${pres.user?.telegramId}`);
        return;
    }

    if (!pres.startHour) {
        console.log(`⚠️ Receta sin hora de inicio (startHour), saltando: ${pres.medicationName}`);
        return;
    }

    const times = calcularTomasDiarias(pres.startHour, pres.intervaloHoras, pres.frequency);
    console.log(`📋 Horarios para ${pres.medicationName} (${pres.user.telegramId}): ${times.join(', ')}`);

    
    if (times.includes(horaActual)) {
        console.log(`✅ Enviando recordatorio a ${pres.user.telegramId}`);
        // Crear un registro en la base de datos de la toma
        const log = new MedicationLog({
            user: pres.user._id,
            prescription: pres._id,
            //scheduledTime: moment(`${horaActual}:00`, 'HH:mm:ss').toDate(), // Hora de la toma
            scheduledTime: moment.tz('Europe/Madrid').toDate(), // ⏰ Momento actual en GMT+2
        });

        await log.save();

        const mensaje = `
        💊 *Recordatorio de medicación*

        Hola *${pres.user.nombre}*, es hora de tomar tu tratamiento:

        • Medicamento: *${pres.medicationName}*  
        • Dosis: *${pres.dosage}*  
        • Hora de toma: *${horaActual}*

        ✅ Cuando lo hayas hecho, pulsa el botón de abajo.
        `;
        

        const opciones = {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
            [{ text: '✅ Confirmar toma', callback_data: `confirm_${log._id}` }]
            ]
        }
        };


        await sendMessageToTelegram(pres.user.telegramId, mensaje,opciones);
    } else {
        console.log(`❌ No coincide la hora actual con los horarios para ${pres.medicationName}`);
    }
    });
      
  };

// Cronjob para enviar recordatorios cada minuto (ajusta la frecuencia según tus necesidades)
cron.schedule('* * * * *', enviarRecordatorio);



// cron.schedule('* * * * *', async () => {
//   try {
//     const now = moment().format('HH:mm');
//     const today = moment().startOf('day');
//     const currentDate = new Date();
//     //const now = moment().format('HH:mm:ss');
//     console.log(`⏰ Cron ejecutado a las ${now}`);

//     const prescriptions = await Prescription.find({
//       isActive: true,
//       startDate: { $lte: currentDate },
//       $or: [
//         { endDate: { $gte: currentDate } },
//         { endDate: null }
//       ]
//     }).populate('user');

//     for (const presc of prescriptions) {
//       const { user, medicationName, dosage, frequency, intervaloHoras, startHour } = presc;
//       if (!user?.telegramID || !startHour) continue;

//       const tomasDelDia = calcularTomasDiarias(startHour, intervaloHoras, frequency);

//       if (tomasDelDia.includes(now)) {
//         await bot.sendMessage(user.telegramID, `💊 *Recordatorio de medicación*\n\nEs hora de tomar:\n- *${medicationName}*\n- Dosis: *${dosage}*`, { parse_mode: 'Markdown' });
//         console.log(`✅ Recordatorio enviado a ${user.name} (${now})`);
//       }
//     }

//   } catch (err) {
//     console.error('❌ Error en cronjob de Telegram:', err);
//   }
// });
