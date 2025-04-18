import React from 'react';
import Navbar from './Navbar';
import ListadoRecetas from './ListadoRecetas';

const MedicacionPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return <div>Cargando...</div>;

  return (
    <>
      <Navbar user={user} />
      <div className="page-container">
        <h1>Mis Medicamentos</h1>
        <ListadoRecetas user={user} />
      </div>
    </>
  );
};

export default MedicacionPage;
