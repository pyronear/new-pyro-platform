import PictureInPictureAltIcon from '@mui/icons-material/PictureInPictureAlt';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import {
  Dialog,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { useState } from 'react';

import { useIsMobile } from '@/utils/useIsMobile';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { LiveContainer } from '../Live/LiveContainer';

interface CameraCardActionsMenuProps {
  cameraName: string;
  anchorEl: null | HTMLElement;
  open: boolean;
  handleClose: () => void;
}

export const CameraCardActionsMenu = ({
  cameraName,
  anchorEl,
  open,
  handleClose,
}: CameraCardActionsMenuProps) => {
  const { t } = useTranslationPrefix('dashboard');
  const isMobile = useIsMobile();
  const [openLive, setOpenLive] = useState(false);

  return (
    <>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
      >
        <MenuItem onClick={() => setOpenLive(true)} disabled={isMobile}>
          <ListItemIcon>
            <SportsEsportsIcon />
          </ListItemIcon>
          <ListItemText primary={t('liveButton')} />
        </MenuItem>
        <MenuItem disabled>
          <ListItemIcon>
            <PictureInPictureAltIcon />
          </ListItemIcon>
          <ListItemText primary={t('maskButton')} />
        </MenuItem>
      </Menu>
      <Dialog
        open={openLive}
        onClose={() => setOpenLive(false)}
        maxWidth="lg"
        fullWidth
      >
        <LiveContainer
          onClose={() => setOpenLive(false)}
          targetCameraName={cameraName}
        />
      </Dialog>
    </>
  );
};
