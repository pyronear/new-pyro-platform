import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Badge,
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
import { useAlertsMenuBadge } from './useAlertsMenuBadge';

export const MobileTopbar = () => {
  const { token } = useAuth();
  const isLoggedIn = !!token;
  const unlabelledAlertsCount = useAlertsMenuBadge(isLoggedIn);

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
                /* The drawer is closed by default, so the count has to reach
                   the button that opens it to be of any use. */
                <Badge
                  badgeContent={unlabelledAlertsCount}
                  color="error"
                  invisible={!unlabelledAlertsCount}
                  sx={{
                    '& .MuiBadge-badge': {
                      fontWeight: 700,
                      right: 2,
                      top: 2,
                    },
                  }}
                >
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label={
                      unlabelledAlertsCount > 0
                        ? t('menuLabelWithAlerts', {
                            count: unlabelledAlertsCount,
                          })
                        : t('menuLabel')
                    }
                    size="small"
                    onClick={() => {
                      setIsDrawerOpen(true);
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                </Badge>
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
        unlabelledAlertsCount={unlabelledAlertsCount}
      />
    </>
  );
};
