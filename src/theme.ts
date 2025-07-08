import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#054546',
      light: '#2C796E',
    },
    error: {
      main: '#FD5252',
      light: '#FC816B',
    },
    background: { default: 'white', paper: 'white' },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          borderRadius: 3,
          // height: '30px',
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
        root: { height: '30px', borderRadius: 3 },
      },
    },
  },
});
