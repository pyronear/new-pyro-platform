import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { Slider, Stack } from '@mui/material';
import { useEffect, useState } from 'react';

import { useActionsOnCamera } from '../../context/useActionsOnCamera';

const MIN_ZOOM = 0;
const MAX_ZOOM = 64;
const STEP_ZOOM = 8;

interface ZoomButtonsProps {
  cameraIp: string;
}

export const ZoomButtons = ({ cameraIp }: ZoomButtonsProps) => {
  const { addStreamingAction } = useActionsOnCamera();
  const [zoom, setZoom] = useState(MIN_ZOOM);

  useEffect(() => {
    setZoom(MIN_ZOOM);
  }, [cameraIp]);

  const onZoomFired = () => {
    addStreamingAction({
      type: 'ZOOM',
      ip: cameraIp,
      params: { zoom },
    });
  };

  return (
    <Stack
      spacing={1}
      alignItems="center"
      sx={{ backgroundColor: '#fff', borderRadius: 2, padding: '4px' }}
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
