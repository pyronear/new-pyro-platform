import Stack from '@mui/material/Stack';

import { hasRotation, hasZoom } from '@/utils/live';

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
      {hasRotation(cameraType) && (
        <NavigationButtons cameraIp={cameraIp} speed={speed} />
      )}
      {hasZoom(cameraType) && <ZoomButtons cameraIp={cameraIp} />}
    </Stack>
  );
};
