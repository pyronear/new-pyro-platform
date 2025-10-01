import { Stack, Typography } from '@mui/material';

import type { CameraType } from '@/services/camera';
import type { CameraFullInfosType } from '@/utils/camera';

interface CameraNameType {
  camera: CameraType | CameraFullInfosType;
}
export const CameraName = ({ camera }: CameraNameType) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography variant="body1">{camera.name}</Typography>
    </Stack>
  );
};
