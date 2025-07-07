import { AppBar, Box, Grid, Toolbar } from '@mui/material';

import logo from '../../assets/logo.svg';
import { useAuth } from '../../context/useAuth';
import { LogoutButton } from '../Login/LogoutButton';
import LanguageSwitcher from './LanguageSwitcher';
import { NavigationLink } from './NavigationLink';

export const Topbar = () => {
  const { token } = useAuth();
  const isLogin = !!token;
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky">
        <Toolbar disableGutters>
          <Grid container justifyContent="space-between" sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
              <img height="30px" src={logo} alt="Logo" />
              {isLogin && (
                <Grid container spacing={2} alignItems="center">
                  <NavigationLink path="/dashboard" label="Dashboard" />
                  <NavigationLink path="/alerts" label="Alerts" />
                </Grid>
              )}
            </Grid>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="space-around"
              paddingRight="1rem"
            >
              <LanguageSwitcher />
              {isLogin && <LogoutButton />}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
