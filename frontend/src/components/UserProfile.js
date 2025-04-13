import React, { useState } from 'react';
import './UserProfile.css';
import EditarPerfilModal from './EditarPerfilModal';
import axios from 'axios';

const UserProfile = ({ user, onTestBot }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(user);

  const handleSave = async (newData) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar el perfil');
      }

      const updatedUser = await response.json();
      setUserData({ ...userData, ...updatedUser });
      localStorage.setItem('user', JSON.stringify({ ...userData, ...newData }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error al guardar los datos:', error.message);
      alert('No se pudieron guardar los datos. Inténtalo de nuevo.');
    }
  };
  const handleTestBotClick = async () => {
    if (!userData.telegramId) {
      return alert('Debes conectar tu Telegram primero.');
    }
    const fullName = `${userData.nombre || 'usuario'} ${userData.apellidos || ''}`.trim();

    const testMessage = `Hola ${fullName} 👋\n\n` +
      `Este es un mensaje de prueba enviado desde *MediTrack*.\n` +
      `Si estás leyendo esto, ¡todo funciona correctamente! ✅\n\n` +
      `Recibirás aquí tus recordatorios de medicación. 💊\n\n` +
      `Gracias por confiar en nosotros.`;

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/users/send-test-message`, {
        chatId: userData.telegramId,
        text: testMessage,
      });
      alert('Mensaje de prueba enviado con éxito.');
    } catch (error) {
      console.error(error);
      alert('Error al enviar el mensaje de prueba.');
    }
  };

  return (
    <div className="user-profile-card">
      <h2 className="user-profile-title">Perfil de Usuario</h2>

      <div className="user-profile-grid">
        <div className="profile-field">
          <span className="field-label">Email</span>
          <span className="field-value">{userData.email}</span>
        </div>
        <div className="profile-field">
          <span className="field-label">Nombre</span>
          <span className="field-value">{userData.nombre || 'No especificado'}</span>
        </div>
        <div className="profile-field">
          <span className="field-label">Apellidos</span>
          <span className="field-value">{userData.apellidos || 'No especificado'}</span>
        </div>
        <div className="profile-field">
          <span className="field-label">ID de Telegram</span>
          <span className="field-value">{userData.telegramId || 'No conectado'}</span>
        </div>
      </div>

      <div className="profile-actions">
        <button className="edit-button-user" onClick={() => setIsEditing(true)}>Editar información</button>
        <button className="test-button-user" onClick={handleTestBotClick}>Probar bot de Telegram</button>
      </div>

      {isEditing && (
        <EditarPerfilModal
          userData={userData}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default UserProfile;
