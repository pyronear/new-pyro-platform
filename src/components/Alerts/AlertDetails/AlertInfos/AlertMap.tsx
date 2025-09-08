import L from 'leaflet';
import { useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

import CameraMarkerMap from '@/components/Common/Map/CameraMarkerMap';
import { CameraViewPolygon } from '@/components/Common/Map/CameraViewPolygon';
import type { SequenceWithCameraInfoType } from '@/utils/alerts';
import { buildVisionPolygon, DEFAULT_CAM_RANGE_KM } from '@/utils/cameraVision';

interface AlertMap {
  sequences: SequenceWithCameraInfoType[];
  height?: number | string;
}

type SequenceWithCamera = SequenceWithCameraInfoType & {
  camera: NonNullable<SequenceWithCameraInfoType['camera']>;
};

const AlertMap = ({ sequences, height = '100%' }: AlertMap) => {
  const sequencesWithPolygons = useMemo(() => {
    return sequences
      .filter((seq): seq is SequenceWithCamera => seq.camera !== null)
      .map((seq) => ({
        ...seq,
        visionPolygonPoints: buildVisionPolygon(
          seq.camera.lat,
          seq.camera.lon,
          seq.coneAzimuth,
          seq.coneAngle,
          DEFAULT_CAM_RANGE_KM
        ),
      }));
  }, [sequences]);

  const allPolygonPoints = sequencesWithPolygons.flatMap((seq) =>
    seq.visionPolygonPoints.map((point) => [point.lat, point.lng])
  );

  return (
    <MapContainer
      bounds={allPolygonPoints as L.LatLngBoundsExpression}
      key={sequences.map((s) => s.id).join(',')} // map is not recentered when a new alert is shown (because bounds don't update automatically) so we use key to force a re-render
      boundsOptions={{ padding: [20, 20] }}
      style={{ height, width: '100%', borderRadius: 4 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {sequencesWithPolygons.map((sequence) => {
        return (
          <div key={sequence.id}>
            <CameraViewPolygon
              visionPolygonPoints={sequence.visionPolygonPoints}
            />
            <CameraMarkerMap camera={sequence.camera} />
          </div>
        );
      })}
    </MapContainer>
  );
};

export default AlertMap;
