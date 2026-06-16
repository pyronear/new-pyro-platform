import Stack from '@mui/material/Stack';

import { calculateHasRotation, calculateHasZoom } from '@/utils/live';

import { NavigationButtons } from './NavigationButtons';
import { ZoomButtons } from './ZoomButtons';

interface FloatingActionsProps {
  cameraId: number;
  cameraType?: string;
  speed: number;
}

export const FloatingActions = ({
  cameraId,
  cameraType = '',
  speed,
}: FloatingActionsProps) => {
  return (
    <>
      <Stack sx={{ position: 'absolute', bottom: 0, left: 0, padding: 1 }}>
        {calculateHasRotation(cameraType) && (
          <NavigationButtons cameraId={cameraId} speed={speed} />
        )}
      </Stack>
      <Stack
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          padding: 1,
          height: 160,
        }}
      >
        {calculateHasZoom(cameraType) && <ZoomButtons cameraId={cameraId} />}
      </Stack>
    </>
  );
};
