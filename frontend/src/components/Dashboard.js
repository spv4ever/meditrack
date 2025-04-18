import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const cardList = [
    {
      title: 'Mi perfil',
      description: 'Gestiona tu perfil y configuración del bot',
      onClick: () => navigate('perfil')
    },
    {
      title: 'Mis medicamentos',
      description: 'Consulta, edita o añade tus recetas',
      onClick: () => navigate('medicacion')
    },
    {
      title: 'Historial de tomas',
      description: 'Revisa cuándo y qué medicación tomaste',
      onClick: () => navigate('logs')
    }
  ];

    // Añadir tarjeta solo si es admin
    if (user?.role === 'admin') {
        cardList.push({
          title: 'Usuarios registrados',
          description: 'Revisa, edita y gestiona los usuarios del sistema',
          onClick: () => navigate('admin/usuarios')
        });
      }

  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1 className="dashboard-title">
          Bienvenido a tu panel de control de medicamentos
        </h1>

        <div className="card-grid">
          {cardList.map((card, index) => (
            <div
              key={index}
              className="dashboard-card"
              onClick={card.onClick}
            >
              <h2 className="card-title">{card.title}</h2>
              <p className="card-description">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
