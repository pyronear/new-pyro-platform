import PictureInPictureAltIcon from '@mui/icons-material/PictureInPictureAlt';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';

import { useTranslationPrefix } from '../../utils/useTranslationPrefix';

interface CameraCardActionsMenuProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  handleClose: () => void;
}

export const CameraCardActionsMenu = ({
  anchorEl,
  open,
  handleClose,
}: CameraCardActionsMenuProps) => {
  const { t } = useTranslationPrefix('dashboard');
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
      <MenuItem disabled>
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
  );
};
