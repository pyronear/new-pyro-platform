import Stack from '@mui/material/Stack';

import { calculateHasRotation, calculateHasZoom } from '@/utils/live';

import type { StreamingAction } from '../../hooks/useStreamingActions';
import { NavigationButtons } from './NavigationButtons';
import { ZoomButtons } from './ZoomButtons';

interface FloatingActionsProps {
  cameraIp: string;
  addStreamingAction: (newAction: StreamingAction) => void;
  cameraType?: string;
  speed: number;
}

export const FloatingActions = ({
  cameraIp,
  addStreamingAction,
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
        <NavigationButtons
          cameraIp={cameraIp}
          speed={speed}
          addStreamingAction={addStreamingAction}
        />
      )}
      {calculateHasZoom(cameraType) && (
        <ZoomButtons
          cameraIp={cameraIp}
          addStreamingAction={addStreamingAction}
        />
      )}
    </Stack>
  );
};
