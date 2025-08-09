import 'leaflet/dist/leaflet.css';

import L, { type LatLngExpression } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import siteIcon from '@/assets/site-icon.png';

import type { CameraType } from '../../services/camera';
import { TooltipCameraMap } from '../Common/TooltipCameraMap';

const customIcon = new L.Icon({
  iconUrl: siteIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface AlertMap {
  cameras: CameraType[];
}

const AlertMap = ({ cameras }: AlertMap) => {
  const coordinates = cameras.map((cam) => [cam.lat, cam.lon]);

  return (
    <MapContainer
      center={coordinates[0] as LatLngExpression}
      zoom={13}
      style={{ height: '100%', width: '100%', borderRadius: 4 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cameras.map((camera) => {
        return (
          <Marker
            key={camera.id}
            position={[camera.lat, camera.lon]}
            icon={customIcon}
          >
            <Popup>
              <TooltipCameraMap camera={camera} />
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default AlertMap;
