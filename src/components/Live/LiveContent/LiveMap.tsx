import L from 'leaflet';
import { useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

import CameraMarkerMap from '@/components/Common/Map/CameraMarkerMap';
import { CameraViewPolygon } from '@/components/Common/Map/CameraViewPolygon';
import { SequencePolygon } from '@/components/Common/Map/SequencePolygon';
import type { SequenceWithCameraInfoType } from '@/utils/alerts';
import {
  buildPolygonFromSequence,
  buildPolygonsFromCamera,
  type CameraFullInfosType,
} from '@/utils/camera';

interface LiveMapProps {
  camera: CameraFullInfosType;
  height?: string;
  minHeight?: string;
  sequence?: SequenceWithCameraInfoType;
}

export const LiveMap = ({
  camera,
  height = '100%',
  minHeight = undefined,
  sequence,
}: LiveMapProps) => {
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
    <MapContainer
      bounds={bounds}
      key={bounds.toBBoxString()}
      boundsOptions={{ padding: [20, 20] }}
      style={{ height, width: '100%', borderRadius: 4, minHeight }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

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
    </MapContainer>
  );
};

export default LiveMap;
