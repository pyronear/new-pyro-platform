import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  IconButton,
  Slide,
  Stack,
  Toolbar,
  useScrollTrigger,
} from '@mui/material';
import { useState } from 'react';

import logo from '@/assets/logo.svg';
import { useAuth } from '@/context/useAuth';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { MobileTopbarDrawer } from './MobileTopbarDrawer';

export const MobileTopbar = () => {
  const { token } = useAuth();
  const isLoggedIn = !!token;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  // The value of this is true when the user just scrolled down, false otherwise
  const shouldHideTopbar = useScrollTrigger();

  const { t } = useTranslationPrefix('topbar');

  return (
    <>
      <Slide appear={false} direction="down" in={!shouldHideTopbar}>
        <AppBar>
          <Toolbar disableGutters>
            <Stack flexGrow={1} direction="row" paddingX="1rem">
              {isLoggedIn && (
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label={t('menuLabel')}
                  size="small"
                  onClick={() => {
                    setIsDrawerOpen(true);
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <img height="30px" src={logo} alt="Logo" />
            </Stack>
          </Toolbar>
        </AppBar>
      </Slide>
      {/* Empty toolbar to account for the above one with fixed position */}
      {/* See https://mui.com/material-ui/react-app-bar/#fixed-placement */}
      <Toolbar />
      <MobileTopbarDrawer
        isOpen={isDrawerOpen}
        handleClose={handleDrawerClose}
      />
    </>
  );
};
