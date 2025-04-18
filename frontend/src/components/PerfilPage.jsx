import React from 'react';
import Navbar from './Navbar';
import UserProfile from './UserProfile';
import './Dashboard.css';

const PerfilPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return <div>Cargando...</div>;

  return (
    <>
      <Navbar user={user} />
      <div className="page-container">
        <h1>Mi Perfil</h1>
        <UserProfile 
          user={user} 
          onEdit={() => console.log('Editar perfil')} 
          onTestBot={() => console.log('Probar bot de Telegram')} 
        />
      </div>
    </>
  );
};

export default PerfilPage;
