import {
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Stack,
} from '@mui/material';
import Card from '@mui/material/Card';
import { type Ref } from 'react';

import noImage from '@/assets/no-image.svg';
import { CameraName } from '@/components/Common/Camera/CameraName';
import type { CameraType } from '@/services/camera';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { CameraCardActions } from './CameraCardActions';
import { CameraCardLastPing } from './CameraCardLastPing';

interface CameraCardType {
  camera: CameraType;
  isSelectable?: boolean;
  isSelected?: boolean;
  setSelected?: () => void;
  ref?: Ref<HTMLDivElement | null>;
}

export const CameraCard = ({
  ref,
  camera,
  isSelectable = false,
  isSelected,
  setSelected,
}: CameraCardType) => {
  const { t } = useTranslationPrefix('dashboard');

  return isSelectable ? (
    <Card sx={{ flexShrink: 0 }} ref={ref}>
      <Stack direction="row" height="100%">
        <CardActionArea
          data-active={isSelected ? '' : undefined}
          onClick={setSelected}
          sx={(theme) => ({
            '&[data-active]': {
              backgroundColor: 'action.selected',
              borderLeft: `3px solid ${theme.palette.primary.light}`,
              '&:hover': {
                backgroundColor: 'action.selectedHover',
              },
            },
          })}
        >
          <Stack direction="row">
            <CardContent sx={{ p: { xs: 1, sm: 2 }, flexGrow: 1 }}>
              <Stack spacing={1}>
                <CameraName
                  name={camera.name}
                  angle_of_view={camera.angle_of_view}
                />
                <CameraCardLastPing camera={camera} />
              </Stack>
            </CardContent>
            <CardMedia
              component="img"
              sx={{
                objectFit: 'fill',
                width: '40%',
              }}
              image={camera.last_image_url ?? noImage}
              title={t('titleImage')}
            />
          </Stack>
        </CardActionArea>
        <CardActions>
          <CameraCardActions isOneIcon={false} cameraName={camera.name} />
        </CardActions>
      </Stack>
    </Card>
  ) : (
    <Card sx={{ flexShrink: 0, borderRadius: '8px' }} ref={ref}>
      <Stack direction="column">
        <CardMedia
          component="img"
          sx={{
            objectFit: 'contain',
          }}
          image={camera.last_image_url ?? noImage}
          title={t('titleImage')}
        />
        <Stack direction="row" justifyContent="space-between">
          <CardContent sx={{ p: { xs: 1, sm: 2 }, flexGrow: 1 }}>
            <Stack spacing={1}>
              <CameraName
                name={camera.name}
                angle_of_view={camera.angle_of_view}
              />
              <CameraCardLastPing camera={camera} />
            </Stack>
          </CardContent>
          <CardActions>
            <CameraCardActions isOneIcon={true} cameraName={camera.name} />
          </CardActions>
        </Stack>
      </Stack>
    </Card>
  );
};
