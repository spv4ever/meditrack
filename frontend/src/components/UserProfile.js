import React from 'react';
import './UserProfile.css';

const UserProfile = ({ user, onEdit, onTestBot }) => {
  return (
    <div className="user-profile-card">
      <h2 className="user-profile-title">Perfil de Usuario</h2>

      <div className="user-profile-grid">
        <div className="profile-field">
          <span className="field-label">Email</span>
          <span className="field-value">{user.email}</span>
        </div>
        <div className="profile-field">
          <span className="field-label">Nombre</span>
          <span className="field-value">{user.nombre || 'No especificado'}</span>
        </div>
        <div className="profile-field">
          <span className="field-label">Apellidos</span>
          <span className="field-value">{user.apellidos || 'No especificado'}</span>
        </div>
        <div className="profile-field">
          <span className="field-label">ID de Telegram</span>
          <span className="field-value">{user.telegramId || 'No conectado'}</span>
        </div>
      </div>

      <div className="profile-actions">
        <button className="edit-button-user" onClick={onEdit}>Editar información</button>
        <button className="test-button-user" onClick={onTestBot}>Probar bot de Telegram</button>
      </div>
    </div>
  );
};

export default UserProfile;
