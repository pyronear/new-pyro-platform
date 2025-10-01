import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningIcon from '@mui/icons-material/Warning';
import { Stack, Typography } from '@mui/material';

import type { CameraType } from '@/services/camera';
import { formatToDateTime, isCameraActive } from '@/utils/dates';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

interface CameraCardLastPingProps {
  camera: CameraType;
}

export const CameraCardLastPing = ({ camera }: CameraCardLastPingProps) => {
  const { t } = useTranslationPrefix('dashboard');
  const isActive = isCameraActive(camera.last_active_at);
  return (
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
  );
};
