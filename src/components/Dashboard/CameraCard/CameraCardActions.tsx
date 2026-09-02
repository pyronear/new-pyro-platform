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
import { useNavigate } from 'react-router';

import { ModalOcclusionMaskWrapper } from '@/components/Dashboard/OcclusionMaskModal/ModalOcclusionMaskWrapper';
import type { CameraType } from '@/services/camera';
import { useIsMobile } from '@/utils/useIsMobile';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

interface CameraCardActionsProps {
  isOneIcon?: boolean;
  camera: CameraType;
}

export const CameraCardActions = ({
  isOneIcon,
  camera,
}: CameraCardActionsProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { t } = useTranslationPrefix('dashboard');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const startLivestreaming = () =>
    void navigate(`/dashboard/livestreaming/${camera.name}`);

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
            <MenuItem onClick={startLivestreaming} disabled={isMobile}>
              <ListItemIcon color="primary">
                <SportsEsportsIcon />
              </ListItemIcon>
              <ListItemText primary={t('liveButton')} />
            </MenuItem>
            <ModalOcclusionMaskWrapper camera={camera}>
              {(onClick) => (
                <MenuItem onClick={onClick}>
                  <ListItemIcon color="primary">
                    <PictureInPictureAltIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('maskButton')} />
                </MenuItem>
              )}
            </ModalOcclusionMaskWrapper>
          </Menu>
        </>
      ) : (
        <Stack spacing={1}>
          <Tooltip title={t('liveButton')}>
            <IconButton
              disabled={isMobile}
              onClick={startLivestreaming}
              color="primary"
            >
              <SportsEsportsIcon />
            </IconButton>
          </Tooltip>
          <ModalOcclusionMaskWrapper camera={camera}>
            {(onClick) => (
              <Tooltip title={t('maskButton')}>
                <IconButton onClick={onClick} color="primary">
                  <PictureInPictureAltIcon />
                </IconButton>
              </Tooltip>
            )}
          </ModalOcclusionMaskWrapper>
        </Stack>
      )}
    </>
  );
};
