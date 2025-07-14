import { useMediaQuery } from '@mui/material';

import { theme } from '../../theme';
import { DesktopTopbar } from './DesktopTopbar';
import { MobileTopbar } from './MobileTopbar';

export const Topbar = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return isMobile ? <MobileTopbar /> : <DesktopTopbar />;
};
