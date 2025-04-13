import React from 'react';
import './ConfigurarBotModal.css';
import qrBotImage from './assets/bot_telegram.png'; // Asegúrate de tener esta imagen

const ConfigurarBotModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Conectar con el Bot de Telegram</h3>
        <img src={qrBotImage} alt="QR para unirse al bot" className="qr-image" />
        <p>Sigue estos pasos para conectar MediTrack con tu Telegram:</p>
        <ol>
          <li>Abre la cámara de tu móvil y escanea el QR.</li>
          <li>Presiona <strong>“Iniciar”</strong> o <code>/start</code> en Telegram para activar el bot.</li>
          <li>Abre el bot <code>@albertgs_bot</code> y sigue las instrucciones.</li>
          <li>Una vez activado, abre el mensaje que recibirás y copia tu <strong>ID de Telegram</strong>.</li>
          <li>Vuelve aquí y pégalo en el campo "ID de Telegram" de tu perfil.</li>
        </ol>
        <p>¡Listo! A partir de ahora recibirás recordatorios en Telegram 📩</p>
        <button className="close-button" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ConfigurarBotModal;
