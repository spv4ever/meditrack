import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Para la redirección

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Para redirigir al login después del registro

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!email || !password) {
      setError('Por favor ingresa tu correo y contraseña.');
      return;
    }

    try {
      // Realiza la petición al backend para registrar al usuario
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Error al registrarse');
        return;
      }

      setSuccessMessage('¡Te has registrado exitosamente! Ahora puedes iniciar sesión.');
      setEmail('');
      setPassword('');
      setError('');

      // Redirige al usuario a la página de login después de un registro exitoso
      setTimeout(() => {
        navigate('/login'); // Redirige al login
      }, 2000); // Espera 2 segundos antes de redirigir para mostrar el mensaje de éxito
    } catch (err) {
      setError('Error al intentar registrarse');
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
        marginTop: 8, // Mismo margen superior que el cuadro de login
      }}
    >
      <Typography
        variant="h4"
        align="center" // Aseguramos que el texto esté centrado
        sx={{ marginBottom: 2 }} // Espaciado entre la cabecera y el formulario
      >
        Regístrate gratuitamente en <br /> MediTrack
      </Typography>
      <form onSubmit={handleRegister} style={{ width: '100%' }}>
        <TextField
          fullWidth
          label="Correo electrónico"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Contraseña"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />
        {error && <Typography color="error">{error}</Typography>}
        {successMessage && <Typography color="primary">{successMessage}</Typography>}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
        >
          Registrarse
        </Button>
      </form>
    </Box>
  );
};

export default Register;
