import PictureInPictureAltIcon from '@mui/icons-material/PictureInPictureAlt';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';

import { useIsMobile } from '@/utils/useIsMobile';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { ModalLiveWrapper } from '../Live/ModalLiveWrapper';

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

  return (
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
      <ModalLiveWrapper cameraName={cameraName}>
        {(onClick) => (
          <MenuItem onClick={onClick} disabled={isMobile}>
            <ListItemIcon>
              <SportsEsportsIcon />
            </ListItemIcon>
            <ListItemText primary={t('liveButton')} />
          </MenuItem>
        )}
      </ModalLiveWrapper>
      <MenuItem disabled>
        <ListItemIcon>
          <PictureInPictureAltIcon />
        </ListItemIcon>
        <ListItemText primary={t('maskButton')} />
      </MenuItem>
    </Menu>
  );
};
