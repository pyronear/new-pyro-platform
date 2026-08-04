import L from 'leaflet';
import { useMemo } from 'react';

import CameraMarker from '@/components/Common/Map/CameraMarker';
import CameraViewLivePolygon from '@/components/Common/Map/CameraViewLivePolygon.tsx';
import { CameraViewPolygon } from '@/components/Common/Map/CameraViewPolygon';
import { SequencePolygon } from '@/components/Common/Map/SequencePolygon';
import TemplateMap from '@/components/Common/Map/TemplateMap';
import { type CameraAzimuthType } from '@/services/live';
import type { SequenceWithCameraInfoType } from '@/utils/alerts';
import {
  buildPolygonFromSequence,
  buildPolygonsFromCamera,
  type CameraFullInfosType,
  DEFAULT_ANGLE_OF_VIEW,
} from '@/utils/camera';
import { buildVisionPolygon, DEFAULT_CAM_RANGE_KM } from '@/utils/cameraVision';

interface LiveMapProps {
  camera: CameraFullInfosType;
  liveAzimuth: CameraAzimuthType | null;
  sequence?: SequenceWithCameraInfoType;
}

export const LiveMap = ({ camera, liveAzimuth, sequence }: LiveMapProps) => {
  const cameraWithPolygons = useMemo(
    () => buildPolygonsFromCamera(camera),
    [camera]
  );

  const sequencePolygon = useMemo(
    () => (sequence ? buildPolygonFromSequence(sequence) : null),
    [sequence]
  );

  const liveCone = useMemo(() => {
    if (liveAzimuth?.azimuth_deg == null) {
      return null;
    }
    // Cone opening narrows with zoom: prefer the calibrated FOV reported by
    // the device over the static angle_of_view (which is the zoom-0 value).
    const angleOfView =
      liveAzimuth.h_fov_deg ?? camera.angle_of_view ?? DEFAULT_ANGLE_OF_VIEW;
    return buildVisionPolygon(
      camera.lat,
      camera.lon,
      liveAzimuth.azimuth_deg,
      angleOfView,
      DEFAULT_CAM_RANGE_KM
    );
  }, [liveAzimuth, camera.lat, camera.lon, camera.angle_of_view]);

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
      {liveAzimuth?.azimuth_deg != null && liveCone && (
        <CameraViewLivePolygon
          azimuth={liveAzimuth.azimuth_deg}
          visionPolygonPoints={liveCone}
        />
      )}
    </TemplateMap>
  );
};

export default LiveMap;
