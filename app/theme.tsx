'use client';
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#1D3557',
      light: '#457B9D',
      dark: '#14263F',
      contrastText: '#FFFFFF',
    },

    secondary: {
      main: '#457B9D',
      light: '#6E9DBA',
      dark: '#2E5973',
      contrastText: '#FFFFFF',
    },

    error: {
      main: '#E63946',
    },

    warning: {
      main: '#F4A261',
    },

    success: {
      main: '#2A9D8F',
    },

    info: {
      main: '#A8DADC',
    },

    background: {
      default: '#F1FAEE',
      paper: '#FFFFFF',
    },

    text: {
      primary: '#1D3557',
      secondary: '#457B9D',
    },

    divider: '#D8E2DC',
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
