import L from 'leaflet';
import { useMemo } from 'react';

import CameraMarker from '@/components/Common/Map/CameraMarker';
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
  const cameraWithPolygons = useMemo(
    () => buildPolygonsFromCamera(camera),
    [camera]
  );

  const sequencePolygon = useMemo(
    () => (sequence ? buildPolygonFromSequence(sequence) : null),
    [sequence]
  );

  const bounds = useMemo(() => {
    const allPolygonPoints = cameraWithPolygons.poses.flatMap(
      (pose) => pose.visionPolygon
    );
    const camerasPoints = [[camera.lat, camera.lon] as L.LatLngExpression];
    return L.latLngBounds(
      allPolygonPoints.length > 0 ? allPolygonPoints : camerasPoints
    );
  }, [camera.lat, camera.lon, cameraWithPolygons]);

  return (
    <TemplateMap bounds={bounds} minHeight="200px">
      <CameraMarker camera={camera} />
      {cameraWithPolygons.poses.map((pose) => (
        <CameraViewPolygon
          key={`${camera.id}_${pose.azimuth}`}
          visionPolygonPoints={pose.visionPolygon}
        />
      ))}
      {sequencePolygon && (
        <SequencePolygon visionPolygonPoints={sequencePolygon} />
      )}
    </TemplateMap>
  );
};

export default LiveMap;
