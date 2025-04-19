import React, { useState, useEffect, useRef } from 'react';
import { LogOut, Menu, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="navbar-logo">MediTrack</div>

        <div className="navbar-links">
          {/* Home */}
          <Link to="/dashboard" className="navbar-link">
            <span className="link-label">Home</span>
            <Home className="link-icon" />
          </Link>

          {/* Menú dropdown */}
          <div className="navbar-dropdown" ref={dropdownRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="navbar-button navbar-link"
            >
              <span className="link-label">Menú</span>
              <Menu className="link-icon" />
            </button>

            {isMenuOpen && (
              <div className="navbar-dropdown-menu">
                <Link
                  to="/dashboard/perfil"
                  className="navbar-dropdown-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Perfil
                </Link>
                <Link
                  to="/dashboard/medicacion"
                  className="navbar-dropdown-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Medicación
                </Link>
                <Link
                  to="/dashboard/logs"
                  className="navbar-dropdown-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Historial de Tomas
                </Link>
                <Link
                  to="/dashboard/contactos"
                  className="navbar-dropdown-item"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contactos
                </Link>
                
              </div>
            )}
          </div>

          {/* Usuario y rol (visible solo en desktop) */}
          <div className="navbar-user desktop-only">
            {user?.email} <span>({user?.role})</span>
          </div>

          {/* Botón salir */}
          <button onClick={onLogout} className="navbar-button logout-button">
            <LogOut size={18} />
            <span className="link-label">Salir</span>
          </button>
        </div>
      </div>

      {/* Usuario visible solo en móvil */}
      <div className="navbar-user mobile-only">
        {user?.email} <span>({user?.role})</span>
      </div>
    </header>
  );
};

export default Navbar;
