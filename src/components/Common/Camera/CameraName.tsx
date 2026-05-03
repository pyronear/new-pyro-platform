import { Stack, Typography } from '@mui/material';

import type { CameraType } from '@/services/camera';
import { formatAzimuth } from '@/utils/alerts';
import type { CameraFullInfosType } from '@/utils/camera';

interface CameraNameType {
  camera: CameraType | CameraFullInfosType;
  azimuth?: number;
}
export const CameraName = ({ camera, azimuth }: CameraNameType) => {
  return (
    <Stack
      direction="row"
      alignItems="space"
      justifyContent="space-between"
      spacing={2}
    >
      <Typography variant="body1">{camera.name}</Typography>
      {azimuth && (
        <Typography variant="caption" fontWeight={500} alignSelf="end">
          {formatAzimuth(azimuth)}
        </Typography>
      )}
    </Stack>
  );
};
