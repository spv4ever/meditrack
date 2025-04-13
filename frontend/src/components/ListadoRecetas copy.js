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
        const response = await fetch('http://192.168.1.180:5000/api/prescriptions', {
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

      const response = await fetch(`http://192.168.1.180:5000/api/prescriptions/${id}/toggle`, {
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
      const response = await fetch(`http://192.168.1.180:5000/api/prescriptions/${id}`, {
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
                  <td>{receta.medicationName}</td>
                  <td>{receta.dosage}</td>
                  <td>{receta.frequency}</td>
                  <td>{receta.intervaloHoras}</td>
                  <td>{receta.startHour}</td>
                  <td>{new Date(receta.startDate).toLocaleDateString()}</td>
                  <td>{receta.endDate ? new Date(receta.endDate).toLocaleDateString() : 'Indefinido'}</td>
                  <td>{receta.isActive ? 'Activo' : 'Inactivo'}</td>
                  <td>
                    {receta.photoUrl ? (
                      <img src={receta.photoUrl} alt="Receta" className="receta-photo" />
                    ) : (
                      'No disponible'
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(receta._id)} className="action-button">
                      <FaEdit size={16} />
                    </button>
                    <button onClick={() => handleToggleActive(receta._id)} className="action-button">
                      {receta.isActive ? <FaRegCircle size={16} /> : <FaRegCheckCircle size={16} />}
                    </button>
                    <button onClick={() => handleDelete(receta._id)} className="action-button">
                      <FaRegTrashAlt size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-recipes">No tienes recetas registradas.</td>
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
                const response = await fetch(`http://192.168.1.180:5000/api/prescriptions/${editingReceta._id}`, {
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
