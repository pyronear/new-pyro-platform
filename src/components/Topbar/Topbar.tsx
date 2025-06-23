import { AppBar, Box, Toolbar } from '@mui/material';

import logo from '../../assets/logo.svg';
import { useAuth } from '../../context/useAuth';
import LanguageSwitcher from './LanguageSwitcher';

export const Topbar = () => {
  const { token } = useAuth();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky">
        <Toolbar>
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <img
              style={{ marginTop: 'auto', marginBottom: 'auto' }}
              height="30px"
              src={logo}
              alt="Logo"
            />
            <LanguageSwitcher />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
