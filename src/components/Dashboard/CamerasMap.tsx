import L, { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import type { RefObject } from 'react';
import { Fragment, useMemo } from 'react';

import type { CameraType } from '@/services/camera';
import { buildPolygonsFromCamera } from '@/utils/camera';

import CameraMarker from '../Common/Map/CameraMarker';
import { CameraViewPolygon } from '../Common/Map/CameraViewPolygon';
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
  const camerasWithPolygons = cameras.map((camera) =>
    buildPolygonsFromCamera(camera)
  );

  const bounds = useMemo(() => {
    const allPolygonPoints = camerasWithPolygons
      .flatMap((camera) => camera.poses)
      .flatMap((pose) => pose.visionPolygon);

    return L.latLngBounds(allPolygonPoints);
  }, [camerasWithPolygons]);

  return (
    <TemplateMap bounds={bounds} setMapRef={setMapRef} showLayerControl>
      {camerasWithPolygons.map((camera) => (
        <Fragment key={camera.id}>
          <CameraMarker
            camera={camera}
            markerRefs={markerRefs}
            onClick={() => onClickOnMarker(camera.id)}
          />
          {camera.poses.map((pose) => (
            <CameraViewPolygon
              key={`${camera.id}_${pose.azimuth}`}
              visionPolygonPoints={pose.visionPolygon}
            />
          ))}
        </Fragment>
      ))}
    </TemplateMap>
  );
};

export default CamerasMap;
