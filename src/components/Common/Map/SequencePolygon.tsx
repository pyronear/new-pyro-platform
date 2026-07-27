import { useTheme } from '@mui/material';
import type { LatLng } from 'leaflet';
import { Polygon } from 'react-leaflet';

interface CameraViewPolygonProps {
  children?: React.ReactNode;
  isHighlighted?: boolean;
  visionPolygonPoints: LatLng[];
  onClick?: () => void;
}

export const SequencePolygon = ({
  children,
  isHighlighted = true,
  visionPolygonPoints,
  onClick,
}: CameraViewPolygonProps) => {
  const theme = useTheme();
  return (
    <Polygon
      positions={visionPolygonPoints}
      pathOptions={{
        color: theme.palette.error.main,
        opacity: isHighlighted ? 0.9 : 0.45,
        fillColor: theme.palette.error.main,
        fillOpacity: isHighlighted ? 0.3 : 0.15,
        weight: isHighlighted ? 4 : 2,
      }}
      eventHandlers={
        onClick
          ? {
              click: onClick,
            }
          : undefined
      }
    >
      {children}
    </Polygon>
  );
};
