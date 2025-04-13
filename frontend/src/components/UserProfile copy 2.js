import React, { useState } from 'react';
import './UserProfile.css';
import EditarPerfilModal from './EditarPerfilModal';

const UserProfile = ({ user, onTestBot }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(user);

  const handleSave = (newData) => {
    setUserData({ ...userData, ...newData });
    setIsEditing(false);

    // TODO: Llamada al backend para guardar los datos si quieres hacerlo persistente
    // Por ejemplo: axios.put('/api/users/update', newData)
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
        <button className="test-button-user" onClick={onTestBot}>Probar bot de Telegram</button>
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
