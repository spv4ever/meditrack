const express = require('express');
const router = express.Router();
const { enviarRecordatorio } = require('../jobs/cronJob'); // importa tu función

router.get('/ejecutar-cron', async (req, res) => {
  const { token } = req.query;
  if (token !== process.env.CRON_TOKEN) {
    return res.status(401).send('No autorizado');
  }

  try {
    await enviarRecordatorio();
    res.send('Recordatorio ejecutado');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al ejecutar');
  }
});

module.exports = router;