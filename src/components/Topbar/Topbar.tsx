import Box from '@mui/material/Box';

import { useIsMobile } from '../../utils/useIsMobile';
import { DesktopTopbar } from './DesktopTopbar';
import { MobileTopbar } from './MobileTopbar';

export const Topbar = () => {
  const isMobile = useIsMobile();

  return (
    <Box sx={{ flexGrow: 0 }}>
      {isMobile ? <MobileTopbar /> : <DesktopTopbar />}
    </Box>
  );
};
