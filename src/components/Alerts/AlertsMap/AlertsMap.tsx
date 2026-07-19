import L from 'leaflet';
import { Fragment, useMemo } from 'react';

import CameraMarker from '@/components/Common/Map/CameraMarker.tsx';
import FirePositionMarkerMap from '@/components/Common/Map/FirePositionMarkerMap.tsx';
import { SequencePolygon } from '@/components/Common/Map/SequencePolygon.tsx';
import TemplateMap from '@/components/Common/Map/TemplateMap.tsx';
import { useCameraList } from '@/context/useCameraList.ts';
import type { AlertType } from '@/utils/alerts.ts';
import {
  buildVisionPolygon,
  DEFAULT_CAM_RANGE_KM,
} from '@/utils/cameraVision.ts';

interface AlertsMapProps {
  alertsList: AlertType[];
  selectedAlert: AlertType | null;
  setSelectedAlert: (newAlert: AlertType) => void;
}

export const AlertsMap = ({
  alertsList,
  selectedAlert,
  setSelectedAlert,
}: AlertsMapProps) => {
  const camerasList = useCameraList();

  const alertsWithPolygons = useMemo(() => {
    return alertsList.map((alert) => ({
      ...alert,
      sequences: alert.sequences
        .filter((seq) => seq.camera !== null)
        .map((seq) => ({
          ...seq,
          visionPolygonPoints: seq.camera
            ? buildVisionPolygon(
                seq.camera.lat,
                seq.camera.lon,
                seq.azimuth,
                seq.coneAngle,
                DEFAULT_CAM_RANGE_KM
              )
            : [],
        })),
    }));
  }, [alertsList]);

  const cameraIdsWithAlert = alertsList
    .flatMap((alert) => alert.sequences)
    .map((seq) => seq.camera?.id);

  const bounds = useMemo(() => {
    const allCameraPoints = camerasList.map(
      (camera) => [camera.lat, camera.lon] as L.LatLngExpression
    );

    return L.latLngBounds(allCameraPoints);
  }, [camerasList]);

  return (
    <TemplateMap bounds={bounds} showLayerControl>
      {alertsWithPolygons.map((alert) => (
        <Fragment key={alert.id}>
          {alert.sequences.map((sequence) => (
            <Fragment key={sequence.id}>
              <SequencePolygon
                isHighlighted={sequence.id == selectedAlert?.id}
                visionPolygonPoints={sequence.visionPolygonPoints}
                onClick={() => setSelectedAlert(alert)}
              />
              {alert.sequences.length > 1 && (
                <FirePositionMarkerMap alert={alert} />
              )}
            </Fragment>
          ))}
        </Fragment>
      ))}
      {camerasList.map((camera) => (
        <CameraMarker
          key={camera.id}
          camera={camera}
          variant={
            cameraIdsWithAlert.includes(camera.id) ? 'primary' : 'secondary'
          }
        />
      ))}
    </TemplateMap>
  );
};
