import { AppBar, Box, Grid, Toolbar } from '@mui/material';

import logo from '../../assets/logo.svg';
import { useAuth } from '../../context/useAuth';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';
import { LogoutButton } from '../Login/LogoutButton';
import LanguageSwitcher from './LanguageSwitcher';
import { NavigationLink } from './NavigationLink';

export const Topbar = () => {
  const { token } = useAuth();
  const { t } = useTranslationPrefix('pages');
  const isLoggedIn = !!token;
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky">
        <Toolbar disableGutters>
          <Grid container justifyContent="space-between" sx={{ flexGrow: 1 }}>
            <Grid container spacing={5}>
              <img height="30px" src={logo} alt="Logo" />
              {isLoggedIn && (
                <Grid container spacing={4} alignItems="center">
                  <NavigationLink path="/dashboard" label={t('dashboard')} />
                  <NavigationLink path="/alerts" label={t('alerts')} />
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
              {isLoggedIn && <LogoutButton />}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
