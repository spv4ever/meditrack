import React, { useEffect, useState } from 'react';
import { FaEdit, FaRegTrashAlt, FaRegCheckCircle, FaRegCircle } from 'react-icons/fa';
import './ListadoRecetas.css';
import EditarRecetaModal from './EditarRecetaModal';

const ListadoRecetas = ({ user }) => {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/prescriptions`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('No se pudo cargar las recetas');
        }

        const data = await response.json();
        setRecetas(data);
      } catch (err) {
        setError('No se pudo obtener las recetas');
      } finally {
        setLoading(false);
      }
    };

    fetchRecetas();
  }, []);
  const [editingReceta, setEditingReceta] = useState(null);

  const handleEdit = (id) => {
  const receta = recetas.find(r => r._id === id);
  setEditingReceta(receta);
};

  const handleToggleActive = async (id) => {
    try {
      const recetaToUpdate = recetas.find((receta) => receta._id === id);
      const updatedReceta = { ...recetaToUpdate, isActive: !recetaToUpdate.isActive };

      setRecetas((prevRecetas) =>
        prevRecetas.map((receta) =>
          receta._id === id ? { ...receta, isActive: updatedReceta.isActive } : receta
        )
      );

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/prescriptions/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ isActive: updatedReceta.isActive }),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar el estado de la receta');
      }
    } catch (err) {
      console.error(err);
      setError('Error al cambiar el estado de la receta');
    }
  };

  const handleDelete = async (id) => {
    // Confirmación antes de eliminar
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta receta?');
    if (!confirmDelete) return; // Si el usuario cancela, no hacemos nada

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/prescriptions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo eliminar la receta');
      }

      // Actualizamos el estado para eliminar la receta de la interfaz
      setRecetas((prevRecetas) => prevRecetas.filter((receta) => receta._id !== id));
    } catch (err) {
      console.error(err);
      setError('Error al eliminar la receta');
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="recetas-list">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Mis Recetas</h2>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Medicamento</th>
              <th>Dosis</th>
              <th>Frecuencia</th>
              <th>Intervalo</th>
              <th>Hora Primera Toma</th>
              <th>Fecha de Inicio</th>
              <th>Fecha de Fin</th>
              <th>Estado</th>
              <th>Foto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {recetas.length > 0 ? (
                recetas.map((receta) => (
                <tr key={receta._id}>
                    <td data-label="Medicamento">{receta.medicationName}</td>
                    <td data-label="Dosis">{receta.dosage}</td>
                    <td data-label="Frecuencia">{receta.frequency}</td>
                    <td data-label="Intervalo">{receta.intervaloHoras}</td>
                    <td data-label="Hora 1ª Toma">{receta.startHour}</td>
                    <td data-label="Fecha Inicio">{new Date(receta.startDate).toLocaleDateString()}</td>
                    <td data-label="Fecha Fin">
                    {receta.endDate ? new Date(receta.endDate).toLocaleDateString() : 'Indefinido'}
                    </td>
                    <td data-label="Estado">{receta.isActive ? 'Activo' : 'Inactivo'}</td>
                    <td data-label="Foto">
                    {receta.photoUrl ? (
                        <img src={receta.photoUrl} alt="Receta" className="receta-photo" />
                    ) : (
                        'No disponible'
                    )}
                    </td>
                    <td data-label="Acciones">
                        <div className="button-group">
                            <button onClick={() => handleEdit(receta._id)} className="action-button edit-button">
                            <FaEdit size={16} />
                            </button>
                            <button onClick={() => handleToggleActive(receta._id)} className="action-button toggle-button">
                            {receta.isActive ? <FaRegCheckCircle size={16} /> : <FaRegCircle size={16} />}
                            </button>
                            <button onClick={() => handleDelete(receta._id)} className="action-button delete-button">
                            <FaRegTrashAlt size={16} />
                            </button>
                        </div>
                        </td>


                </tr>
                ))
            ) : (
                <tr>
                <td colSpan="10" className="no-recipes">No tienes recetas registradas.</td>
                </tr>
            )}
            </tbody>
        </table>
      </div>
      {editingReceta && (
        <EditarRecetaModal
            receta={editingReceta}
            onClose={() => setEditingReceta(null)}
            onSave={async (updatedData) => {
                console.log('Datos enviados al backend:', updatedData); // 👈 Añade esto
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/prescriptions/${editingReceta._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(updatedData),
                });

                if (!response.ok) throw new Error('Error al actualizar');

                const updated = await response.json();

                // Actualiza el estado de recetas
                setRecetas(prev =>
                prev.map(r => (r._id === updated._id ? updated : r))
                );

                setEditingReceta(null);
            } catch (err) {
                alert('Error al actualizar la receta.');
            }
            }}
        />
        )}

    </div>
  );
  
};

export default ListadoRecetas;
