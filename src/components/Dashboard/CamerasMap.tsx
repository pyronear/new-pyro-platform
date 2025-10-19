import L, { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import type { RefObject } from 'react';
import { useMemo } from 'react';

import type { CameraType } from '@/services/camera';

import CameraMarkerMap from '../Common/Map/CameraMarkerMap';
import TemplateMap from '../Common/Map/TemplateMap';

interface CamerasMapProps {
  cameras: CameraType[];
  setMapRef: (map: LeafletMap) => void;
  markerRefs: RefObject<Map<number, LeafletMarker>>;
  onClickOnMarker: (cameraId: number) => void;
}

export const CamerasMap = ({
  cameras,
  setMapRef,
  markerRefs,
  onClickOnMarker,
}: CamerasMapProps) => {
  const bounds = useMemo(() => {
    const allCamerasPoints = cameras.map(
      (c) => [c.lat, c.lon] as L.LatLngExpression
    );
    return L.latLngBounds(allCamerasPoints);
  }, [cameras]);

  return (
    <TemplateMap bounds={bounds} setMapRef={setMapRef}>
      {cameras.map((camera) => (
        <CameraMarkerMap
          key={camera.id}
          camera={camera}
          markerRefs={markerRefs}
          onClick={() => onClickOnMarker(camera.id)}
        />
      ))}
    </TemplateMap>
  );
};

export default CamerasMap;
