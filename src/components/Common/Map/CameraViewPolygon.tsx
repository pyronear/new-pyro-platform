import type { LatLng } from 'leaflet';
import { Polygon } from 'react-leaflet';

interface CameraViewPolygonProps {
  visionPolygonPoints: LatLng[];
}

export const CameraViewPolygon = ({
  visionPolygonPoints,
}: CameraViewPolygonProps) => {
  return (
    <Polygon
      positions={visionPolygonPoints}
      pathOptions={{
        color: '#ff7800',
        opacity: 0.5,
        fillColor: '#ff7800',
        fillOpacity: 0.2,
        weight: 2,
      }}
    />
  );
};
