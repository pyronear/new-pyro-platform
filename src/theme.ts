import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#054546',
      light: '#2C796E',
    },
    background: { default: 'white', paper: 'white' },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          borderRadius: 8,
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
  },
});
