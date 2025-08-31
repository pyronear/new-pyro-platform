import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WarningIcon from '@mui/icons-material/Warning';
import {
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import Card from '@mui/material/Card';
import { type Ref, useState } from 'react';

import noImage from '@/assets/no-image.svg';

import type { CameraType } from '../../services/camera';
import { formatToDateTime, isCameraActive } from '../../utils/dates';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';
import { CameraName } from '../Common/CameraName';
import { CameraCardActionsMenu } from './CameraCardActionsMenu';

interface CameraCardType {
  camera: CameraType;
  isHorizontal?: boolean;
  isSelected?: boolean;
  setSelected?: () => void;
  ref?: Ref<HTMLDivElement | null>;
}

export const CameraCard = ({
  ref,
  camera,
  isHorizontal = false,
  isSelected,
  setSelected,
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
    <Card
      sx={{ flexShrink: 0, borderRadius: isHorizontal ? undefined : '8px' }}
      ref={ref}
    >
      <CardActionArea
        data-active={isSelected ? '' : undefined}
        onClick={setSelected}
        sx={(theme) => ({
          height: '100%',
          '&[data-active]': {
            backgroundColor: 'action.selected',
            borderLeft: `3px solid ${theme.palette.primary.light}`,
            '&:hover': {
              backgroundColor: 'action.selectedHover',
            },
          },
        })}
      >
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
      </CardActionArea>
    </Card>
  );
};
