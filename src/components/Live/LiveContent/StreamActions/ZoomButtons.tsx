import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { Slider, Stack } from '@mui/material';

import { MAX_ZOOM, MIN_ZOOM } from '@/utils/live.ts';

import { useActionsOnCamera } from '../../context/useActionsOnCamera';

const STEP_ZOOM = 8;

interface ZoomButtonsProps {
  cameraId: number;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
}

export const ZoomButtons = ({ cameraId, zoom, setZoom }: ZoomButtonsProps) => {
  const { addStreamingAction } = useActionsOnCamera();

  const onZoomFired = () => {
    addStreamingAction({
      type: 'ZOOM',
      id: cameraId,
      params: { zoom },
    });
  };

  return (
    <Stack
      spacing={1}
      alignItems="center"
      sx={{
        backgroundColor: '#fff',
        borderRadius: 2,
        padding: '4px',
        height: '100%',
      }}
    >
      <ZoomInIcon />
      <Slider
        value={zoom}
        step={STEP_ZOOM}
        marks
        color="primary"
        min={MIN_ZOOM}
        max={MAX_ZOOM}
        orientation="vertical"
        onChange={(_event, value: number) => setZoom(value)}
        onChangeCommitted={onZoomFired}
        sx={{
          '.MuiSlider-thumb': { height: '16px', width: '16px' },
        }}
      />
      <ZoomOutIcon />
    </Stack>
  );
};
