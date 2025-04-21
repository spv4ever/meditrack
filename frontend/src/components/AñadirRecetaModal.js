import React, { useState } from 'react';
import './AñadirRecetaModal.css'; // reutilizando estilos del modal de edición

const AñadirRecetaModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    medicationName: '',
    dosage: '',
    frequency: 1,
    intervaloHoras: 24,
    startDate: '',
    endDate: '',
    startHour: '08:00',
    photoUrl: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'frequency') {
      const newFrequency = parseInt(value, 10);
      const newIntervaloHoras = newFrequency > 0 ? Math.floor(24 / newFrequency) : 1;
      setFormData(prev => ({
        ...prev,
        frequency: newFrequency,
        intervaloHoras: newIntervaloHoras,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos a enviar:', formData); // <--- Aquí
    const frequency = parseInt(formData.frequency, 10);
    const intervaloHoras = parseInt(formData.intervaloHoras, 10);

    if (!formData.startHour || isNaN(frequency) || isNaN(intervaloHoras)) {
      setError('Todos los campos obligatorios deben estar completos y válidos.');
      return;
    }

    if (frequency * intervaloHoras > 24) {
      setError('La frecuencia multiplicada por el intervalo no puede ser mayor a 24 horas.');
      return;
    }

    setError('');
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Añadir nueva receta</h2>
        <form onSubmit={handleSubmit}>
          <div className="three-columns">
            <input
              type="text"
              name="medicationName"
              placeholder='Medicamento'
              value={formData.medicationName}
              onChange={handleChange}
              required
            />
            </div>
            <div className="three-columns">
            <input 
              type="text"
              name="dosage"
              placeholder='Dosis'
              value={formData.dosage}
              onChange={handleChange}
              required
            /></div>
          <div className="three-columns">
            <label>
              Tomas al día:
              <input
                type="number"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                min="1"
                required
              />
            </label>
          
            <label>
              Cada x horas:
              <input
                type="number"
                name="intervaloHoras"
                value={formData.intervaloHoras}
                onChange={handleChange}
                disabled
                required
              />
            </label>
          
            <label>
              Hora primera toma:
              <input
                type="time"
                name="startHour"
                value={formData.startHour}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className="three-columns">
            <label>
              Fecha inicio:
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Fecha fin:
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="three-columns">
          <label>
            Foto URL:
            <input
              type="text"
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
            />
          </label></div>

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

export default AñadirRecetaModal;
