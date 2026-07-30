import { useTheme } from '@mui/material';
import type { LatLng } from 'leaflet';
import { Polygon, Tooltip } from 'react-leaflet';

import { formatAzimuth } from '@/utils/alerts.ts';

interface CameraViewLivePolygonProps {
  azimuth: number;
  visionPolygonPoints: LatLng[];
}

/**
 * Red cone showing where the camera is currently pointing (live azimuth).
 * Dashed border to distinguish it from the plain detection sequence cone.
 */
const CameraViewLivePolygon = ({
  azimuth,
  visionPolygonPoints,
}: CameraViewLivePolygonProps) => {
  const theme = useTheme();
  return (
    <Polygon
      positions={visionPolygonPoints}
      pathOptions={{
        color: theme.palette.error.main,
        opacity: 0.9,
        fillColor: theme.palette.error.main,
        fillOpacity: 0.1,
        weight: 3,
        dashArray: '6 6',
      }}
    >
      <Tooltip>{formatAzimuth(azimuth)}</Tooltip>
    </Polygon>
  );
};

export default CameraViewLivePolygon;
