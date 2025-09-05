import MoreVertIcon from '@mui/icons-material/MoreVert';
import PictureInPictureAltIcon from '@mui/icons-material/PictureInPictureAlt';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';

import { ModalLiveWrapper } from '@/components/Live/ModalLiveWrapper';
import { useIsMobile } from '@/utils/useIsMobile';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

interface CameraCardActionsProps {
  isOneIcon?: boolean;
  cameraName: string;
}

export const CameraCardActions = ({
  isOneIcon,
  cameraName,
}: CameraCardActionsProps) => {
  const isMobile = useIsMobile();
  const { t } = useTranslationPrefix('dashboard');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isOneIcon ? (
        <>
          <IconButton
            id="basic-button"
            onClick={handleClick}
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <MoreVertIcon />
          </IconButton>
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
        </>
      ) : (
        <Stack spacing={1}>
          <ModalLiveWrapper cameraName={cameraName}>
            {(onClick) => (
              <Tooltip title={t('liveButton')}>
                <IconButton disabled={isMobile} onClick={onClick}>
                  <SportsEsportsIcon />
                </IconButton>
              </Tooltip>
            )}
          </ModalLiveWrapper>
          <Tooltip title={t('maskButton')}>
            <IconButton disabled>
              <PictureInPictureAltIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      )}
    </>
  );
};
