import { AppBar, Stack, Toolbar } from '@mui/material';
import { Link } from 'react-router-dom';

import { DEFAULT_ROUTE } from '@/App';
import logo from '@/assets/logo.svg';

import { useAuth } from '../../context/useAuth';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';
import { NavigationLink } from './NavigationLink';
import { PreferencesButton } from './PreferencesButton';

export const DesktopTopbar = () => {
  const { t } = useTranslationPrefix('pages');
  const { token } = useAuth();
  const isLoggedIn = !!token;

  return (
    <>
      <AppBar>
        <Toolbar disableGutters>
          <Stack
            direction="row"
            justifyContent="space-between"
            flexGrow={1}
            alignItems="center"
            px={2}
          >
            <Stack direction="row" spacing={5} alignItems="center">
              <Link to={DEFAULT_ROUTE}>
                <img height="30px" src={logo} alt="Logo" />
              </Link>
              {isLoggedIn && (
                <Stack direction="row" spacing={2}>
                  <NavigationLink path="/alerts" label={t('alerts')} />
                  <NavigationLink path="/dashboard" label={t('dashboard')} />
                  <NavigationLink path="/history" label={t('history')} />
                </Stack>
              )}
            </Stack>
            <PreferencesButton />
          </Stack>
        </Toolbar>
      </AppBar>
      {/* Empty toolbar to account for the above one with fixed position */}
      {/* See https://mui.com/material-ui/react-app-bar/#fixed-placement */}
      <Toolbar />
    </>
  );
};
