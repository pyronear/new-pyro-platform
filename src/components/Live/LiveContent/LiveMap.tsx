import L from 'leaflet';
import { useMemo } from 'react';

import CameraMarkerMap from '@/components/Common/Map/CameraMarkerMap';
import { CameraViewPolygon } from '@/components/Common/Map/CameraViewPolygon';
import { SequencePolygon } from '@/components/Common/Map/SequencePolygon';
import TemplateMap from '@/components/Common/Map/TemplateMap';
import type { SequenceWithCameraInfoType } from '@/utils/alerts';
import {
  buildPolygonFromSequence,
  buildPolygonsFromCamera,
  type CameraFullInfosType,
} from '@/utils/camera';

interface LiveMapProps {
  camera: CameraFullInfosType;
  sequence?: SequenceWithCameraInfoType;
}

export const LiveMap = ({ camera, sequence }: LiveMapProps) => {
  const cameraPolygons = useMemo(
    () => buildPolygonsFromCamera(camera),
    [camera]
  );

  const sequencePolygon = useMemo(
    () => (sequence ? buildPolygonFromSequence(sequence) : null),
    [sequence]
  );

  const bounds = useMemo(() => {
    const allPolygonPoints = cameraPolygons
      .map((polygon) => polygon.visionPolygon)
      .flatMap((p) => p);
    const camerasPoints = [[camera.lat, camera.lon] as L.LatLngExpression];
    return L.latLngBounds(
      allPolygonPoints.length > 0 ? allPolygonPoints : camerasPoints
    );
  }, [camera.lat, camera.lon, cameraPolygons]);

  return (
    <TemplateMap bounds={bounds} minHeight="200px">
      <CameraMarkerMap camera={camera} />
      {cameraPolygons.map((polygon) => (
        <CameraViewPolygon
          key={`${camera.id}_${polygon.azimuth}`}
          visionPolygonPoints={polygon.visionPolygon}
        />
      ))}
      {sequencePolygon && (
        <SequencePolygon visionPolygonPoints={sequencePolygon} />
      )}
    </TemplateMap>
  );
};

export default LiveMap;
