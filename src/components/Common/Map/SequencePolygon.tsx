import { useTheme } from '@mui/material';
import type { LatLng } from 'leaflet';
import { Polygon } from 'react-leaflet';

interface CameraViewPolygonProps {
  isHighlighted?: boolean;
  visionPolygonPoints: LatLng[];
}

export const SequencePolygon = ({
  isHighlighted = true,
  visionPolygonPoints,
}: CameraViewPolygonProps) => {
  const theme = useTheme();
  return (
    <Polygon
      positions={visionPolygonPoints}
      pathOptions={{
        color: theme.palette.error.main,
        opacity: isHighlighted ? 0.9 : 0.2,
        fillColor: theme.palette.error.main,
        fillOpacity: isHighlighted ? 0.35 : 0.08,
        weight: isHighlighted ? 4 : 2,
      }}
    />
  );
};
