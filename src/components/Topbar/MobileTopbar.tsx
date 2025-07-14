import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Grid,
  IconButton,
  Slide,
  Toolbar,
  useScrollTrigger,
} from '@mui/material';
import { useState } from 'react';

import logo from '../../assets/logo.svg';
import { useAuth } from '../../context/useAuth';
import { LogoutButton } from '../Login/LogoutButton';
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

  return (
    <>
      <Slide appear={false} direction="down" in={!shouldHideTopbar}>
        <AppBar>
          <Toolbar disableGutters>
            <Grid container justifyContent="space-between" sx={{ flexGrow: 1 }}>
              <Grid container spacing={5} paddingLeft="12px">
                {isLoggedIn ? (
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ m: '0' }}
                    onClick={() => {
                      setIsDrawerOpen(true);
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                ) : (
                  <img height="30px" src={logo} alt="Logo" />
                )}
              </Grid>
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="space-around"
                paddingRight="1rem"
              >
                {isLoggedIn && <LogoutButton />}
              </Grid>
            </Grid>
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
