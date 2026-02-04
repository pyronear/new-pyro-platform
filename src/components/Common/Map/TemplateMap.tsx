import L, { Map as LeafletMap } from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';

interface CameraMapProps {
  children: React.ReactNode;
  bounds: L.LatLngBounds;
  height?: string;
  minHeight?: string;
  setMapRef?: (map: LeafletMap) => void;
}

export const TemplateMap = ({
  height = '100%',
  minHeight,
  children,
  bounds,
  setMapRef,
}: CameraMapProps) => {
  return (
    <MapContainer
      bounds={bounds}
      key={bounds.toBBoxString()}
      boundsOptions={{ padding: [20, 20] }}
      style={{ height, width: '100%', borderRadius: 4, minHeight }}
      ref={
        (m: LeafletMap) => {
          if (setMapRef) setMapRef(m);
        } // give map ref to parent component
      }
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {children}
    </MapContainer>
  );
};

export default TemplateMap;
