'use client';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light', 
    primary: {
      main: '#f244c4', 
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2de0fa', 
      contrastText: '#073b42',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#28242c',
      secondary: '#76707c',
    },
    error: {
      main: '#e5484d',
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), sans-serif',
    h1: { fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 700 },
    h2: { fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 600 },
    h3: { fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 600 },
    h4: { fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 600 },
    h5: { fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500 },
    h6: { fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 500 },
  },
  shape: {
    borderRadius: 12, 
  },
});