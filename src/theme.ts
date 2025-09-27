import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
  interface Palette {
    secondaryText: Palette['primary'];
    customBackground: Palette['primary'];
  }

  interface PaletteOptions {
    secondaryText?: PaletteOptions['primary'];
    customBackground?: PaletteOptions['primary'];
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: '#054546',
      light: '#2C796E',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f6b52a',
      light: '#fac044',
      dark: '#c99523',
      contrastText: '#000',
    },
    secondaryText: {
      main: '#a9a7a7',
    },
    error: {
      main: '#FD5252',
      light: '#FC816B',
    },
    background: { default: '#eef1f0' },
    customBackground: {
      main: '#eef1f0',
      light: '#f4f5f5',
      dark: '#dce6ea',
      contrastText: '#000',
    },
  },
  typography: {
    fontFamily: 'Open Sans',
    h1: {
      fontWeight: 700,
      fontSize: '1.5rem',
      fontFamily: 'Open Sans Condensed',
    },
    h2: {
      fontWeight: 700,
      fontSize: '1.3rem',
      fontFamily: 'Open Sans Condensed',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    h4: {
      fontWeight: 500,
      fontSize: '0.85rem',
    },
    body2: {
      // for user messages
      fontSize: '1rem',
      fontWeight: 500,
      textAlign: 'center',
      margin: '2rem',
    },
    caption: {
      fontSize: '0.85rem',
    },
    subtitle1: {
      fontWeight: 300,
      fontSize: '0.95rem',
    },
    subtitle2: {
      fontSize: '0.85rem',
      fontWeight: 400,
    },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          borderRadius: 3,
          boxShadow:
            '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)', // same as MUIButton according to ChatGPT
        },
        icon: {
          color: '#444', // dropdown arrow
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#e0e0e0',
          },
          '&.Mui-selected': {
            backgroundColor: '#d0d0d0',
            '&:hover': {
              backgroundColor: '#c0c0c0',
            },
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        margin: 'normal',
        fullWidth: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 3,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          // apparently Drawer does not inherit these colors, so need to set them manually
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        }),
      },
    },
    MuiTypography: {
      styleOverrides: {
        subtitle2: ({ theme }) => ({
          color: theme.palette.secondaryText.main,
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          '& .MuiChip-label:empty': { paddingLeft: 0 },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&:disabled': { backgroundColor: theme.palette.grey[600] },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '2px',
        },
      },
    },
  },
});
