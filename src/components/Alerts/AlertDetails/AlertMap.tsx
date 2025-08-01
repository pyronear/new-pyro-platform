import 'leaflet/dist/leaflet.css';

import { Typography } from '@mui/material';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import siteIcon from '@/assets/site-icon.png';

import type { SequenceWithCameraInfoType } from '../../../utils/alerts';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';

const customIcon = new L.Icon({
  iconUrl: siteIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface AlertMap {
  sequences: SequenceWithCameraInfoType[];
  height?: number;
}

type SequenceWithCamera = SequenceWithCameraInfoType & {
  camera: NonNullable<SequenceWithCameraInfoType['camera']>;
};

const AlertMap = ({ sequences, height = 200 }: AlertMap) => {
  const { t } = useTranslationPrefix('alerts');

  const coordinates = sequences
    .filter((seq): seq is SequenceWithCamera => seq.camera !== null)
    .map((seq) => [seq.camera.lat, seq.camera.lon]);

  return (
    <MapContainer
      bounds={coordinates as L.LatLngBoundsExpression}
      boundsOptions={{ padding: [20, 20] }}
      style={{ height, width: '100%', borderRadius: 4 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {sequences.map((sequence) => {
        if (!sequence.camera) {
          return null;
        }
        return (
          <Marker
            key={sequence.id}
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
        );
      })}
    </MapContainer>
  );
};

export default AlertMap;
