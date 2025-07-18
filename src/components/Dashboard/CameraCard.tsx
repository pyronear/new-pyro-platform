import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningIcon from '@mui/icons-material/Warning';
import { CardContent, CardMedia, Grid, Stack, Typography } from '@mui/material';
import Card from '@mui/material/Card';

import noImage from '../../assets/no-image.svg';
import type { CameraType } from '../../services/camera';
import { formatToDateTime, isCameraActive } from '../../utils/dates';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';
import { CameraName } from '../Common/CameraName';

interface CameraCardType {
  camera: CameraType;
}

export const CameraCard = ({ camera }: CameraCardType) => {
  const { t } = useTranslationPrefix('dashboard');
  const isActive = isCameraActive(camera.last_active_at);

  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardMedia
        component="img"
        sx={{ objectFit: 'contain' }}
        image={camera.last_image_url ?? noImage}
        title={t('titleImage')}
      />
      <CardContent>
        <Grid container direction="column" spacing={2}>
          <CameraName name={camera.name} angle_of_view={camera.angle_of_view} />
          <Stack spacing={1} direction="row" alignItems="center">
            {isActive ? <AccessTimeIcon /> : <WarningIcon color="error" />}
            {isActive ? (
              <Typography variant="caption">
                {formatToDateTime(camera.last_active_at)}
              </Typography>
            ) : (
              <Typography
                color="error"
                variant="caption"
                textAlign="center"
                fontWeight="700"
              >
                {camera.last_active_at
                  ? formatToDateTime(camera.last_active_at)
                  : t('inactiveCameraMsg')}
              </Typography>
            )}
          </Stack>
        </Grid>
      </CardContent>
    </Card>
  );
};
