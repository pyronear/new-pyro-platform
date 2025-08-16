import L from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';

import type { CameraType } from '../../services/camera';
import CameraMarkerMap from '../Common/Map/CameraMarkerMap';

interface CameraMapProps {
  cameras: CameraType[];
  height?: string;
}

export const CameraMap = ({ cameras, height = '100%' }: CameraMapProps) => {
  const bounds = L.latLngBounds(cameras.map((c) => [c.lat, c.lon]));
  return (
    <div>
      <MapContainer
        bounds={bounds}
        key={bounds.toBBoxString()}
        boundsOptions={{ padding: [20, 20] }}
        style={{ height, width: '100%', borderRadius: 4 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cameras.map((camera) => (
          <CameraMarkerMap camera={camera} key={camera.id} />
        ))}
      </MapContainer>
    </div>
  );
};

export default CameraMap;
