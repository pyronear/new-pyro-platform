import { Typography } from '@mui/material';
import L from 'leaflet';
import { useMemo } from 'react';
import { MapContainer, Marker, Polygon, Popup, TileLayer } from 'react-leaflet';

import siteIcon from '@/assets/site-icon.png';
import type { SequenceWithCameraInfoType } from '@/utils/alerts';
import { buildVisionPolygon, DEFAULT_CAM_RANGE_KM } from '@/utils/cameraVision';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

const customIcon = new L.Icon({
  iconUrl: siteIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface AlertMap {
  sequences: SequenceWithCameraInfoType[];
  height?: number | string;
}

type SequenceWithCamera = SequenceWithCameraInfoType & {
  camera: NonNullable<SequenceWithCameraInfoType['camera']>;
};

const AlertMap = ({ sequences, height = '100%' }: AlertMap) => {
  const { t } = useTranslationPrefix('alerts');

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
            {/* Vision cone polygon */}
            <Polygon
              positions={sequence.visionPolygonPoints}
              pathOptions={{
                color: '#ff7800',
                opacity: 0.5,
                fillColor: '#ff7800',
                fillOpacity: 0.2,
                weight: 2,
              }}
            />
            {/* Camera marker */}
            <Marker
              position={[sequence.camera.lat, sequence.camera.lon]}
              icon={customIcon}
            >
              <Popup>
                <div>
                  <div>
                    <Typography
                      variant="caption"
                      sx={{ fontWeight: 'bold', mb: 1 }}
                    >
                      {sequence.camera.name}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="caption" sx={{ mb: 0.5 }}>
                      {t('mapElevation')}: {sequence.camera.elevation}m
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="caption" sx={{ mb: 0.5 }}>
                      {t('mapAngleOfView')}: {sequence.camera.angle_of_view}°
                    </Typography>
                  </div>
                </div>
              </Popup>
            </Marker>
          </div>
        );
      })}
    </MapContainer>
  );
};

export default AlertMap;
