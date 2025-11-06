import { AppBar, Button, Stack, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import logo from '@/assets/logo.svg';

import { useAuth } from '../../context/useAuth';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';
import { LogoutButton } from '../Login/LogoutButton';
import LanguageSwitcher from './LanguageSwitcher';
import { NavigationLink } from './NavigationLink';

export const DesktopTopbar = () => {
  const { t } = useTranslationPrefix('pages');
  const { token } = useAuth();
  const navigate = useNavigate();
  const isLoggedIn = !!token;

  const handleLogoClick = async () => {
    if (!isLoggedIn) {
      return;
    }
    await navigate('/alerts');
  };

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
              <Button
                disabled={!isLoggedIn}
                startIcon={<img height="30px" src={logo} alt="Logo" />}
                onClick={() => void handleLogoClick()}
              />
              {isLoggedIn && (
                <Stack direction="row" spacing={2}>
                  <NavigationLink path="/alerts" label={t('alerts')} />
                  <NavigationLink path="/dashboard" label={t('dashboard')} />
                  <NavigationLink path="/history" label={t('history')} />
                </Stack>
              )}
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="space-around"
            >
              <LanguageSwitcher />
              {isLoggedIn && <LogoutButton />}
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
      {/* Empty toolbar to account for the above one with fixed position */}
      {/* See https://mui.com/material-ui/react-app-bar/#fixed-placement */}
      <Toolbar />
    </>
  );
};
