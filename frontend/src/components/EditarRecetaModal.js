import React, { useState, useEffect } from 'react';
import './EditarRecetaModal.css';

const EditarRecetaModal = ({ receta, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    medicationName: '',
    dosage: '',
    frequency: '',
    intervaloHoras: 1,
    startDate: '',
    endDate: '',
    startHour: '08:00',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (receta) {
      setFormData({
        medicationName: receta.medicationName || '',
        dosage: receta.dosage || '',
        frequency: receta.frequency || '',
        intervaloHoras: receta.intervaloHoras || 1,
        startDate: receta.startDate ? receta.startDate.slice(0, 10) : '',
        endDate: receta.endDate ? receta.endDate.slice(0, 10) : '',
        startHour: receta.startHour || '08:00',
      });
    }
  }, [receta]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'frequency') {
      const newFrequency = value;
      const newIntervaloHoras = newFrequency ? Math.floor(24 / newFrequency) : 1;
      setFormData(prev => ({
        ...prev,
        frequency: newFrequency,
        intervaloHoras: newIntervaloHoras,
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.frequency * formData.intervaloHoras > 24) {
      setError('La frecuencia multiplicada por el intervalo no puede ser mayor a 24 horas.');
      return;
    }

    await onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Editar Receta</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="medicationName"
            value={formData.medicationName}
            onChange={handleChange}
            placeholder="Nombre del medicamento"
          />
          <input
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            placeholder="Dosis"
          />
          <input
            type="number"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            placeholder="Frecuencia (veces al día)"
            min="1"
          />
          <input
            type="number"
            name="intervaloHoras"
            value={formData.intervaloHoras}
            onChange={handleChange}
            placeholder="Intervalo en horas"
            disabled
          />
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
          <input
            type="time"
            name="startHour"
            value={formData.startHour}
            onChange={handleChange}
            placeholder="Hora de inicio"
          />

          {error && <p className="error">{error}</p>}

          <div className="modal-buttons">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarRecetaModal;
