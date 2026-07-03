'use client';

import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export const theme = createTheme({
  cssVariables: true,

  typography: {
    fontFamily: 'var(--font-inter)',
  },

  palette: {
    mode: 'light',

    primary: {
      light: '#8EC5FF',
      main: '#5B8DEF',
      dark: '#3B6EDC',
      contrastText: '#FFFFFF',
    },

    secondary: {
      light: '#CBB7FF',
      main: '#9D7CFF',
      dark: '#7C5CFA',
      contrastText: '#FFFFFF',
    },

    success: {
      main: '#55C79A',
    },

    warning: {
      main: '#FFB84D',
    },

    error: {
      main: '#FF6B81',
    },

    info: {
      main: '#6FD3FF',
    },

    background: {
      default: '#F8F9FE',
      paper: '#FFFFFF',
    },

    text: {
      primary: '#25324B',
      secondary: '#6E7A94',
    },

    divider: '#E5EAF5',
  },

  shape: {
    borderRadius: 12,
  },
});

const ThemeProviderComp = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default ThemeProviderComp;
