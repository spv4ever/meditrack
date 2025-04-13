import React, { useState } from 'react';
import { Button, TextField, Link, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Cambiar a useNavigate

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Usar useNavigate en lugar de useHistory

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!email || !password) {
      setError('Por favor ingresa tu correo y contraseña.');
      return;
    }

    try {
      // Realiza la petición al backend para autenticar al usuario
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError('Credenciales inválidas');
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Guarda el token en el localStorage
      localStorage.setItem('user', JSON.stringify(data)); // Guarda los datos del usuario

      // Redirige a la página principal después de iniciar sesión
      navigate('/dashboard'); // Cambiar history.push por navigate
    } catch (err) {
      setError('Error al iniciar sesión');
    }
  };

  const handleRegister = () => {
    // Redirige a la página de registro
    navigate('/register'); // Cambiar history.push por navigate
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
        marginTop: 5, // Ajustar para bajar el recuadro de login
      }}
    >
      {/* Cabecera con el nombre de la aplicación */}
      <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', marginBottom: 3 }}>
        MediTrack
      </Typography>

      <Typography variant="h4" gutterBottom>
        Iniciar sesión
      </Typography>
      <form onSubmit={handleLogin} style={{ width: '100%' }}>
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
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
        >
          Iniciar sesión
        </Button>
      </form>
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="body2" color="text.secondary">
          ¿No tienes cuenta?{' '}
          <Link
            component="button"
            variant="body2"
            onClick={handleRegister}
          >
            Regístrate
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
