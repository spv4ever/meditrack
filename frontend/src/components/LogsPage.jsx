import React from 'react';
import Navbar from './Navbar';
import ListadoLogs from './ListadoLogs';

const LogsPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return <div>Cargando...</div>;
  
  return (
    <>
      <Navbar user={user} />
      <div className="page-container">
        <h1>Historial de Tomas</h1>
        <ListadoLogs user={user} />
      </div>
    </>
  );
};

export default LogsPage;
