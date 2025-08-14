import { AppBar, Grid, Toolbar } from '@mui/material';

import logo from '@/assets/logo.svg';

import { useAuth } from '../../context/useAuth';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';
import { LogoutButton } from '../Login/LogoutButton';
import LanguageSwitcher from './LanguageSwitcher';
import { NavigationLink } from './NavigationLink';

export const DesktopTopbar = () => {
  const { t } = useTranslationPrefix('pages');
  const { token } = useAuth();
  const isLoggedIn = !!token;

  return (
    <>
      <AppBar>
        <Toolbar disableGutters>
          <Grid container justifyContent="space-between" sx={{ flexGrow: 1 }}>
            <Grid container spacing={5} sx={{ paddingLeft: '12px' }}>
              <img height="30px" src={logo} alt="Logo" />
              {isLoggedIn && (
                <Grid container spacing={4} alignItems="center">
                  <NavigationLink path="/alerts" label={t('alerts')} />
                  <NavigationLink path="/dashboard" label={t('dashboard')} />
                  <NavigationLink path="/history" label={t('history')} />
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
      {/* Empty toolbar to account for the above one with fixed position */}
      {/* See https://mui.com/material-ui/react-app-bar/#fixed-placement */}
      <Toolbar />
    </>
  );
};
