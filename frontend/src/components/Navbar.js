import React from 'react';
import { LogOut } from 'lucide-react';
import './Navbar.css'; // Asegúrate de tener este archivo CSS si lo usas.

const Navbar = ({ user, onLogout }) => {
    // Verifica si user es un objeto válido
  if (!user) {
    return <div>Loading...</div>; // Opcional: muestra un mensaje de carga si no hay datos de usuario
  }
  return (
    <header className="navbar">
      {/* Logo de la app */}
      <div className="navbar-logo">MediTrack</div>

      {/* Enlaces y botón de logout */}
      <div className="navbar-links">
        <a href="/dashboard" className="navbar-link">Home</a>
    {/* Información del usuario */}
    <div className="navbar-user">
            {user?.email} <span>({user?.role})</span> {/* Aquí se muestran los datos del usuario */}
        </div>
        
        <button onClick={onLogout} className="navbar-button">
          <LogOut size={18} />
          <span>Salir</span>
        </button>
        
        
      </div>
    </header>
  );
};

export default Navbar;
