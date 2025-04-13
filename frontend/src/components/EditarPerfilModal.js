import React, { useState, useEffect } from 'react';
//import './EditarPerfilModal.css';

const EditarPerfilModal = ({ userData, onClose, onSave }) => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carga
  const [error, setError] = useState(''); // Estado para errores

  // Cargar los datos del usuario cuando se abra el modal
  useEffect(() => {
    if (userData) {
      setNombre(userData.nombre || '');
      setApellidos(userData.apellidos || '');
      setTelegramId(userData.telegramId || '');
    }
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación simple
    if (!nombre || !apellidos || !telegramId) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Enviar los datos a través de la función onSave (pasando los datos editados)
      await onSave({
        nombre,
        apellidos,
        telegramId,
      });
    } catch (error) {
      setError('Error al guardar los datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Editar Perfil</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </label>
          <label>
            Apellidos:
            <input
              type="text"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
            />
          </label>
          <label>
            ID de Telegram:
            <input
              type="text"
              value={telegramId}
              onChange={(e) => setTelegramId(e.target.value)}
            />
          </label>

          {error && <p className="error-message">{error}</p>}

          <div className="modal-buttons">
            <button type="submit" className="save-button" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarPerfilModal;
