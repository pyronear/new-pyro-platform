import { useTheme } from '@mui/material';
import type { LatLng } from 'leaflet';
import { Polygon } from 'react-leaflet';

interface CameraViewPolygonProps {
  visionPolygonPoints: LatLng[];
}

export const SequencePolygon = ({
  visionPolygonPoints,
}: CameraViewPolygonProps) => {
  const theme = useTheme();
  return (
    <Polygon
      positions={visionPolygonPoints}
      pathOptions={{
        color: theme.palette.error.main,
        opacity: 0.5,
        fillColor: theme.palette.error.main,
        fillOpacity: 0.2,
        weight: 3,
      }}
    />
  );
};
