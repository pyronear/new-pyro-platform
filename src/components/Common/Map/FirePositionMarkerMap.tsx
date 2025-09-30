import Typography from '@mui/material/Typography';
import { Marker, Popup } from 'react-leaflet';

import type { AlertType } from '@/utils/alerts';

import { fireIcon } from './Icons';

interface FirePositionMarkerMapType {
  alert: AlertType;
  onClick?: () => void;
}

const FirePositionMarkerMap = ({
  alert,
  onClick,
}: FirePositionMarkerMapType) => {
  return (
    <Marker
      position={alert.sequences[0].eventSmokeLocation}
      icon={fireIcon}
      eventHandlers={
        onClick
          ? {
              click: onClick,
            }
          : undefined
      }
    >
      <Popup>
        <div>
          <div>
            <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 1 }}>
              {/* TODO find out what to put in the fire icon popup */}
              {alert.sequences.map((sequence) => sequence.camera?.name)}
            </Typography>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default FirePositionMarkerMap;
