import L, { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

import type { CameraType } from '../../services/camera';
import CameraMarkerMap from '../Common/Map/CameraMarkerMap';

interface CameraMapProps {
  cameras: CameraType[];
  height?: string;
  setMapRef: (map: LeafletMap) => void;
  markerRefs: RefObject<Map<number, LeafletMarker>>;
  setSelectedCameraId: Dispatch<SetStateAction<number | null>>;
}

export const CameraMap = ({
  cameras,
  height = '100%',
  setMapRef,
  markerRefs,
  setSelectedCameraId,
}: CameraMapProps) => {
  const bounds = L.latLngBounds(cameras.map((c) => [c.lat, c.lon]));
  return (
    <MapContainer
      bounds={bounds}
      key={bounds.toBBoxString()}
      boundsOptions={{ padding: [20, 20] }}
      style={{ height, width: '100%', borderRadius: 4 }}
      ref={(m: LeafletMap) => setMapRef(m)} // give map ref to parent component
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {cameras.map((camera) => (
        <CameraMarkerMap
          camera={camera}
          key={camera.id}
          markerRefs={markerRefs}
          onClick={() => setSelectedCameraId(camera.id)}
        />
      ))}
    </MapContainer>
  );
};

export default CameraMap;
