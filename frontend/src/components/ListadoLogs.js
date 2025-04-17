import React, { useEffect, useState } from 'react';
import './ListadoLogs.css';

const ListadoLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = storedUser?.id;
    const token = storedUser?.token;

    if (!userId || !token) {
      setError('No se encontró el ID del usuario o el token.');
      setLoading(false);
      return;
    }

    const fetchLogs = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${userId}/logs`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error al obtener logs. Status: ${response.status}`);
        }

        const data = await response.json();
        setLogs(data);
      } catch (err) {
        console.error('Error al obtener logs:', err);
        setError('No se pudieron obtener los logs.');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="logs-list">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Historial de Medicación</h2>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Medicamento</th>
              <th>Hora Programada</th>
              <th>Estado</th>
              <th>Confirmado a las</th>
            </tr>
          </thead>
          <tbody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log._id}>
                  <td>{log.prescription?.medicationName || 'Sin nombre'}</td>
                  <td>{formatDateTime(log.scheduledTime)}</td>
                  <td>{log.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}</td>
                  <td>
                    {log.status === 'confirmed'
                      ? formatDateTime(log.confirmedAt)
                      : '—'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-logs">
                  No tienes registros aún.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListadoLogs;
