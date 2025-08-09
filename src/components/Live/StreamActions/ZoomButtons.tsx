import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';

import { zoomCamera } from '@/services/live';

import { CustomFab } from './CustomFab';

const MIN_ZOOM = 0;
const MAX_ZOOM = 64;
const STEP_ZOOM = 4;

interface ZoomButtonsProps {
  cameraIp: string;
}

export const ZoomButtons = ({ cameraIp }: ZoomButtonsProps) => {
  const [zoom, setZoom] = useState(MIN_ZOOM);

  useEffect(() => {
    setZoom(MIN_ZOOM);
  }, [cameraIp]);

  const onClickZoomIn = () => {
    const newZoom = zoom + STEP_ZOOM;
    setZoom(newZoom);
    void zoomCamera(cameraIp, newZoom);
  };
  const onClickZoomOut = () => {
    const newZoom = zoom - STEP_ZOOM;
    setZoom(newZoom);
    void zoomCamera(cameraIp, newZoom);
  };

  return (
    <Stack spacing={1}>
      <CustomFab onClick={onClickZoomIn} disabled={zoom === MAX_ZOOM}>
        <ZoomInIcon />
      </CustomFab>
      <CustomFab onClick={onClickZoomOut} disabled={zoom === MIN_ZOOM}>
        <ZoomOutIcon />
      </CustomFab>
    </Stack>
  );
};
