import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { Fab, Stack } from '@mui/material';
import { useEffect, useState } from 'react';

import { zoomCamera } from '@/services/live';

import type { StreamingAction } from '../../hooks/useStreamingActions';

const MIN_ZOOM = 0;
const MAX_ZOOM = 64;
const STEP_ZOOM = 4;

interface ZoomButtonsProps {
  cameraIp: string;
  addStreamingAction: (newAction: StreamingAction) => void;
}

export const ZoomButtons = ({
  cameraIp,
  addStreamingAction,
}: ZoomButtonsProps) => {
  const [zoom, setZoom] = useState(MIN_ZOOM);

  useEffect(() => {
    setZoom(MIN_ZOOM);
  }, [cameraIp]);

  const onClickZoomIn = () => {
    const newZoom = zoom + STEP_ZOOM;
    setZoom(newZoom);
    addStreamingAction({
      type: 'ZOOM',
      ip: cameraIp,
      params: { zoom: newZoom },
    });
    void zoomCamera(cameraIp, newZoom);
  };
  const onClickZoomOut = () => {
    const newZoom = zoom - STEP_ZOOM;
    setZoom(newZoom);
    addStreamingAction({
      type: 'ZOOM',
      ip: cameraIp,
      params: { zoom: newZoom },
    });
  };

  return (
    <Stack spacing={1}>
      <Fab onClick={onClickZoomIn} disabled={zoom === MAX_ZOOM} size="medium">
        <ZoomInIcon />
      </Fab>
      <Fab onClick={onClickZoomOut} disabled={zoom === MIN_ZOOM} size="medium">
        <ZoomOutIcon />
      </Fab>
    </Stack>
  );
};
