import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Usa Routes y Route de React Router v6
import Login from './components/Login';
import Register from './components/Register'; // Asegúrate de importar el componente Register
import Dashboard from './components/Dashboard';
import ResetPassword from './components/ResetPassword';
import RequestPasswordReset from './components/RequestPasswordReset';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Ruta para el registro */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/recuperar-password" element={<RequestPasswordReset />} />
      </Routes>
    </Router>
  );
}

export default App;

