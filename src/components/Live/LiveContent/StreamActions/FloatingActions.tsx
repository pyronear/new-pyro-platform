import Stack from '@mui/material/Stack';

import { calculateHasZoom } from '@/utils/live';

import { ZoomButtons } from './ZoomButtons';

interface FloatingActionsProps {
  cameraId: number;
  cameraType?: string;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
}

export const FloatingActions = ({
  cameraId,
  cameraType = '',
  zoom,
  setZoom,
}: FloatingActionsProps) => {
  return (
    <Stack
      sx={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        padding: 1,
        height: 160,
      }}
    >
      {calculateHasZoom(cameraType) && (
        <ZoomButtons cameraId={cameraId} zoom={zoom} setZoom={setZoom} />
      )}
    </Stack>
  );
};
