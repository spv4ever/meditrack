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
    photoUrl: '', // Campo para la foto de la receta
  });
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(''); // Para mostrar el preview de la imagen

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
        photoUrl: receta.photoUrl || '', // Mantener la URL de la foto si existe
      });
      setImagePreview(receta.photoUrl || ''); // Si existe una foto, mostrarla en el preview
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
    } else if (name === 'photoUrl') {
      // Cuando se selecciona una imagen
      const file = e.target.files[0];
      if (file) {
        setImagePreview(URL.createObjectURL(file)); // Mostrar el preview de la imagen
        setFormData(prev => ({
          ...prev,
          photoUrl: file, // Mantener el archivo de la foto
        }));
      }
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

    // Si se seleccionó una imagen, debes manejar la subida
    if (formData.photoUrl instanceof File) {
      // Verifica el tamaño del archivo antes de enviarlo
      const fileSizeMB = formData.photoUrl.size / (1024 * 1024); // Tamaño en MB
      if (fileSizeMB > 2) {
        // Si el archivo es más grande que 2 MB, muestra el mensaje de error
        setError("La imagen supera el tamaño máximo de 2MB.");
        return;
      }
    
      const formDataToSend = new FormData();
      formDataToSend.append("photo", formData.photoUrl);
    
      try {
        const uploadRes = await fetch(`${process.env.REACT_APP_API_URL}/api/prescriptions/photo/${receta._id}`, {
          method: "PUT",
          body: formDataToSend,
        });
    
        const updatedReceta = await uploadRes.json();
    
        if (!uploadRes.ok) {
          // Si el backend devuelve un error (por ejemplo, 400), lo manejamos aquí
          setError(updatedReceta.message || "Ocurrió un error al subir la foto");
          return;
        }
    
        // Si todo va bien, actualiza el formData con la URL de la foto subida
        await onSave({
          ...formData,
          photoUrl: updatedReceta.photoUrl,
        });
    
      } catch (error) {
        console.error("Error al subir la foto al backend:", error);
        setError("Error de conexión con el servidor");
      }
    }
    else {
      await onSave(formData); // no se cambió la foto
    }
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

          {/* Campo para cargar la foto */}
          <input
            type="file"
            name="photoUrl"
            onChange={handleChange}
          />
          {imagePreview && (
            <div>
              <p>Vista previa de la foto:</p>
              <img src={imagePreview} alt="Vista previa" style={{ maxWidth: '100px' }} />
            </div>
          )}

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
