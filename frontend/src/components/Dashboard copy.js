import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Asegúrate de que la ruta sea la correcta
import './Dashboard.css'; // Asegúrate de importar el archivo CSS
import ListadoRecetas from './ListadoRecetas';  // Asegúrate de tener la ruta correcta
import UserProfile from './UserProfile';
import ListadoLogs from './ListadoLogs';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtén los datos del usuario desde localStorage al montar el componente
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser); // Si hay datos del usuario, los seteamos
    } else {
      navigate('/login'); // Si no hay usuario, redirige a login
    }
  }, [navigate]);
  

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login'); // Redirige a login después de cerrar sesión
  };
  if (!user) {
    return <div>Loading...</div>; // Si no hay datos de usuario, muestra loading
  }
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra de navegación superior */}
      <Navbar user={user} onLogout={handleLogout} />
      
      {/* Contenido del dashboard */}
      <div className="p-6 custom-margin">
        <h1 className="text-2xl font-bold text-gray-800 mx-auto text-center">Bienvenido a tu panel de control de medicamentos</h1>
        {/* Aquí irán más componentes del dashboard */}
        <UserProfile 
            user={user} 
            onEdit={() => console.log('Editar perfil')} 
            onTestBot={() => console.log('Probar bot de Telegram')} 
        />
        <ListadoRecetas user={user} />
        <ListadoLogs user={user} />
      </div>
    </div>
  );
};

export default Dashboard;
