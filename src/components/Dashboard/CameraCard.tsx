import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WarningIcon from '@mui/icons-material/Warning';
import {
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import Card from '@mui/material/Card';
import { useState } from 'react';

import noImage from '@/assets/no-image.svg';

import type { CameraType } from '../../services/camera';
import { formatToDateTime, isCameraActive } from '../../utils/dates';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';
import { CameraName } from '../Common/CameraName';
import { CameraCardActionsMenu } from './CameraCardActionsMenu';

interface CameraCardType {
  camera: CameraType;
  isHorizontal?: boolean;
}

export const CameraCard = ({
  camera,
  isHorizontal = false,
}: CameraCardType) => {
  const { t } = useTranslationPrefix('dashboard');
  const isActive = isCameraActive(camera.last_active_at);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card sx={{ borderRadius: 2, flexShrink: 0 }}>
      <Stack direction={isHorizontal ? 'row-reverse' : 'column'}>
        <CardMedia
          component="img"
          sx={{
            objectFit: isHorizontal ? 'fill' : 'contain',
            width: isHorizontal ? '40%' : 'unset',
          }}
          image={camera.last_image_url ?? noImage}
          title={t('titleImage')}
        />
        <CardContent sx={{ p: { xs: 1, sm: 2 }, flexGrow: 1 }}>
          <Stack direction="column" spacing={1}>
            <Stack
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <CameraName
                name={camera.name}
                angle_of_view={camera.angle_of_view}
              />
              <div>
                <IconButton
                  id="basic-button"
                  onClick={handleClick}
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                >
                  <MoreVertIcon />
                </IconButton>
                <CameraCardActionsMenu
                  anchorEl={anchorEl}
                  open={open}
                  handleClose={handleClose}
                />
              </div>
            </Stack>
            <Stack spacing={1} direction="row" alignItems="center">
              {isActive ? (
                <>
                  <AccessTimeIcon fontSize="small" />
                  <Typography variant="subtitle1">
                    {formatToDateTime(camera.last_active_at)}
                  </Typography>
                </>
              ) : (
                <>
                  <WarningIcon color="error" fontSize="small" />
                  <Typography
                    color="error"
                    variant="subtitle1"
                    textAlign="center"
                    fontWeight="700"
                  >
                    {camera.last_active_at
                      ? formatToDateTime(camera.last_active_at)
                      : t('inactiveCameraMsg')}
                  </Typography>
                </>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Stack>
    </Card>
  );
};
