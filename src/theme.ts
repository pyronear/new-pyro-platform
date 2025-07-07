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
      contrastText: 'white',
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
      contrastText: 'black',
    },
  },
  typography: {
    h1: {
      fontWeight: 700,
      fontSize: '1.5rem',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.3rem',
    },
    h4: {
      fontWeight: 500,
      fontSize: '1rem',
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
        root: { borderRadius: 3 },
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
  },
});
