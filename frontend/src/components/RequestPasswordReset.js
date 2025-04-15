// src/pages/RequestPasswordReset.js
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RequestPasswordReset = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email) {
      setError('Por favor, introduce tu correo electrónico.');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error al solicitar el restablecimiento.');
        return;
      }

      setSuccessMessage('📩 Revisa tu correo. Si existe una cuenta con ese email, te hemos enviado un enlace para restablecer la contraseña.');
      setEmail('');
    } catch (err) {
      setError(err.message || 'Ocurrió un error inesperado.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: 400,
        margin: 'auto',
        padding: 2,
        boxShadow: 3,
        borderRadius: 1,
        marginTop: 8,
      }}
    >
      <Typography variant="h5" align="center" sx={{ marginBottom: 2 }}>
        Recuperar Contraseña
      </Typography>
      <Typography align="center" sx={{ marginBottom: 2 }}>
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <TextField
          fullWidth
          label="Correo electrónico"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
        {successMessage && <Typography color="primary" sx={{ mt: 1 }}>{successMessage}</Typography>}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
        >
          Enviar enlace
        </Button>
      </form>
      <Typography sx={{ mt: 2 }} align="center">
        ¿Recuerdas tu contraseña?{' '}
        <span
          style={{ color: '#1976d2', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => navigate('/login')}
        >
          Inicia sesión
        </span>
      </Typography>
    </Box>
  );
};

export default RequestPasswordReset;
