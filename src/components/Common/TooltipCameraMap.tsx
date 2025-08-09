import Typography from '@mui/material/Typography';

import type { CameraType } from '../../services/camera';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';

interface TooltipCameraMapType {
  camera: CameraType;
}

export const TooltipCameraMap = ({ camera }: TooltipCameraMapType) => {
  const { t } = useTranslationPrefix('alerts');
  return (
    <div>
      <div>
        <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 1 }}>
          {camera.name}
        </Typography>
      </div>

      <div>
        <Typography variant="caption" sx={{ mb: 0.5 }}>
          {t('mapElevation')}: {camera.elevation}m
        </Typography>
      </div>
      <div>
        <Typography variant="caption" sx={{ mb: 0.5 }}>
          {t('mapAngleOfView')}: {camera.angle_of_view}°
        </Typography>
      </div>
    </div>
  );
};
