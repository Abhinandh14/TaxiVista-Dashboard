import React from 'react';
import { Typography, Link, Box } from '@mui/material';
import { useTheme } from './ThemeProvider';

const Footer = () => {
  const { darkMode } = useTheme(); // Accessing darkMode state from ThemeProvider

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: darkMode ? '#333' : '#f8f9fa', // Adjust background color based on darkMode
        padding: '20px',
        position: 'fixed',
        bottom: '0',
        width: '100%',
        textAlign: 'center',
        color: darkMode ? '#fff' : 'text.secondary', // Adjust text color based on darkMode
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} TaxiVista. All rights reserved.
      </Typography>

      <Box mt={1}>
        <Link href="#" color="text.secondary" style={{ marginRight: '8px' }}>
          Privacy Policy
        </Link>
        <Link href="#" color="text.secondary">
          Terms of Service
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
