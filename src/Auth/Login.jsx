import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { Container, Typography, Button, TextField, Box, Link, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../components/ThemeProvider';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { darkMode } = useTheme(); // Accessing darkMode state from ThemeProvider

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        console.log('Google Sign-In successful', user);
        
        // Get the Firebase Authentication token
        const token = await user.getIdToken();

        // Save the token in local storage
        localStorage.setItem('authToken', token);

        onLogin();
        navigate('/');
      })
      .catch((error) => {
        setError(error.message);
        console.error('Google Sign-In error:', error.message);
      });
  };

  const handleEmailSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      console.log('Email/Password Sign-In successful', user);

      // Get the Firebase Authentication token
      const token = await user.getIdToken();

      // Save the token in local storage
      localStorage.setItem('authToken', token);

      onLogin();
      navigate('/');
    } catch (error) {
      setError(error.message);
      console.error('Email/Password Sign-In error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: darkMode ? '#333' : 'transparent', // Adjust background color based on darkMode
        color: darkMode ? '#fff' : 'inherit', // Adjust text color based on darkMode
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          padding: '16px',
          boxShadow: 1,
          borderRadius: '8px',
          backgroundColor: darkMode ? '#444' : '#fff', // Adjust card background color based on darkMode
        }}
      >
        <Typography variant="h4" sx={{ color: darkMode ? '#fff' : 'inherit' }}>Login</Typography>

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleGoogleSignIn}
          style={{ marginTop: '16px' }}
        >
          Sign In With Google
        </Button>

        <form
          onSubmit={(e) => {
            e.preventDefault(); // Prevent the form from submitting
            handleEmailSignIn();
          }}
          style={{ width: '100%', marginTop: '16px' }}
        >
          <TextField
            label="Email address"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              backgroundColor: darkMode ? '#666' : '#fff', // Adjust input background color based on darkMode
              color: darkMode ? '#fff' : 'inherit', // Adjust text color based on darkMode
            }}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              backgroundColor: darkMode ? '#666' : '#fff', // Adjust input background color based on darkMode
              color: darkMode ? '#fff' : 'inherit', // Adjust text color based on darkMode
            }}
          />

          <Button
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginTop: '16px' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </form>

        {error && (
          <Box sx={{ marginTop: '16px', color: 'error.main' }}>
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}

        <Box sx={{ marginTop: '16px', textAlign: 'center' }}>
          <Link href="#" color="primary">
            Forgot password?
          </Link>
        </Box>

        <Box sx={{ marginTop: '16px', textAlign: 'center' }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link href="/register" color="primary">
              Register
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
