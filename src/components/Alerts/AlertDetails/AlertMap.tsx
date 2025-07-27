import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import siteIcon from '@/assets/site-icon.png';

import type { SequenceWithCameraInfoType } from '../../../utils/alerts';

const customIcon = new L.Icon({
  iconUrl: siteIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface CameraMapProps {
  sequences: SequenceWithCameraInfoType[];
  height?: number;
}

export default function AlertMap({ sequences, height = 200 }: CameraMapProps) {
  const coordinates = sequences.map(
    (seq) => [seq.camera?.lat, seq.camera?.lon] as [number, number]
  );

  return (
    <MapContainer
      bounds={coordinates}
      boundsOptions={{ padding: [20, 20] }}
      style={{ height, width: '100%', borderRadius: 4 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {sequences.map((sequence) => (
        <Marker
          key={sequence.id}
          position={
            [sequence.camera?.lat, sequence.camera?.lon] as [number, number]
          }
          icon={customIcon}
        >
          <Popup>
            <div>
              <strong>{sequence.camera?.name}</strong>
              <br />
              Elevation: {sequence.camera?.elevation}m
              <br />
              Angle of view: {sequence.camera?.angle_of_view}°
              <br />
              Location: {sequence.camera?.lat.toFixed(6)},{' '}
              {sequence.camera?.lon.toFixed(6)}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
