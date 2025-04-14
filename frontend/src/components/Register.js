import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const isPasswordValid = passwordRegex.test(password);
  const doPasswordsMatch = password === confirmPassword;

  const isFormValid = email && isPasswordValid && confirmPassword && doPasswordsMatch;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!email || !password || !confirmPassword) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (!isPasswordValid) {
      setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.');
      return;
    }

    if (!doPasswordsMatch) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
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
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Error al intentar registrarse');
    }
  };

  const renderPasswordMatch = () => {
    if (!confirmPassword) return null;
    return doPasswordsMatch
      ? <Typography color="success.main">✅ Contraseña confirmada</Typography>
      : <Typography color="error">❌ Las contraseñas no coinciden</Typography>;
  };

  const renderPasswordStrength = () => {
    if (!password) return null;
    return isPasswordValid
      ? <Typography color="success.main">✅ Contraseña segura</Typography>
      : <Typography color="warning.main">⚠️ Mín. 8 caracteres, mayúscula, minúscula y número</Typography>;
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
      <Typography variant="h4" align="center" sx={{ marginBottom: 2 }}>
        Regístrate gratis en <br /> MediTrack <br /> Cuenta PRO <br /> para Versión Alpha
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
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {renderPasswordStrength()}
        <TextField
          fullWidth
          label="Confirmar contraseña"
          type={showConfirmPassword ? 'text' : 'password'}
          variant="outlined"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          margin="normal"
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {renderPasswordMatch()}
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
        {successMessage && <Typography color="primary" sx={{ mt: 1 }}>{successMessage}</Typography>}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ marginTop: 2 }}
          disabled={!isFormValid}
        >
          Registrarse
        </Button>
      </form>
    </Box>
  );
};

export default Register;
