import Stack from '@mui/material/Stack';

import { calculateHasRotation, calculateHasZoom } from '@/utils/live';

import { NavigationButtons } from './NavigationButtons';
import { ZoomButtons } from './ZoomButtons';

interface FloatingActionsProps {
  cameraIp: string;
  cameraType?: string;
  speed: number;
}

export const FloatingActions = ({
  cameraIp,
  cameraType = '',
  speed,
}: FloatingActionsProps) => {
  return (
    <Stack
      sx={{ position: 'absolute', bottom: 0, padding: 1, width: '100%' }}
      justifyContent="space-between"
      alignItems="flex-end"
      direction="row"
      spacing={1}
    >
      {calculateHasRotation(cameraType) && (
        <NavigationButtons cameraIp={cameraIp} speed={speed} />
      )}
      {calculateHasZoom(cameraType) && <ZoomButtons cameraIp={cameraIp} />}
    </Stack>
  );
};
