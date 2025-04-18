import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Usa Routes y Route de React Router v6
import Login from './components/Login';
import Register from './components/Register'; // Asegúrate de importar el componente Register
import Dashboard from './components/Dashboard';
import ResetPassword from './components/ResetPassword';
import RequestPasswordReset from './components/RequestPasswordReset';
import Layout from './components/Layout';
import PerfilPage from './components/PerfilPage';
import MedicacionPage from './components/MedicacionPage';
import LogsPage from './components/LogsPage';
import UserSummaryCard from './components/UserSummaryCard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Ruta para el registro */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/recuperar-password" element={<RequestPasswordReset />} />
        

        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="perfil" element={<PerfilPage />} />
          <Route path="medicacion" element={<MedicacionPage />} />
          <Route path="logs" element={<LogsPage />} />
          <Route path="/dashboard/admin/usuarios" element={<UserSummaryCard />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;

