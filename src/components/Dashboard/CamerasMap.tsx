import L from 'leaflet';
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

//TODO : fix the partial loading of the map to remove this patch component
// const ComponentResize = () => {
//   const map = useMap();

//   setTimeout(() => {
//     map.invalidateSize();
//   }, 0);

//   return null;
// };

const AlertMap = ({ cameras }: AlertMap) => {
  const bounds = L.latLngBounds(cameras.map((c) => [c.lat, c.lon]));
  return (
    <div>
      <MapContainer
        bounds={bounds}
        key={bounds.toBBoxString()}
        boundsOptions={{ padding: [20, 20] }}
        style={{ height: '80vh', width: '100%', borderRadius: 4 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* <ComponentResize /> */}
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
    </div>
  );
};

export default AlertMap;
