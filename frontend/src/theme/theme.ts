import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff6f61',
      light: '#ffb199',
      dark: '#c43e2f',
    },
    secondary: {
      main: '#7c4dff',
      light: '#b47cff',
      dark: '#3f1d99',
    },
    background: {
      default: '#181a20',
      paper: '#23242b',
    },
    text: {
      primary: '#fff',
      secondary: '#b0bec5',
    },
    error: {
      main: '#ff5252',
    },
    warning: {
      main: '#ffb300',
    },
    success: {
      main: '#00e676',
    },
    info: {
      main: '#29b6f6',
    },
  },
  shape: {
    borderRadius: 24,
  },
  typography: {
    fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.85rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 20,
          padding: '10px 20px',
          fontWeight: 600,
        },
        contained: {
          boxShadow: '0px 4px 16px rgba(255,111,97,0.15)',
          '&:hover': {
            boxShadow: '0px 6px 24px rgba(255,111,97,0.25)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0px 8px 32px rgba(0,0,0,0.25)',
          background: '#23242b',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: '#23242b',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: '0 12px 12px 0',
          background: '#181a20',
        },
      },
    },
  },
}); 