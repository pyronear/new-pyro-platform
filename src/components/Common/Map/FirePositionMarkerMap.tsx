import Typography from '@mui/material/Typography';
import { Marker, Popup } from 'react-leaflet';

import { type AlertType, formatPosition } from '@/utils/alerts';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { fireIcon } from './Icons';

interface FirePositionMarkerMapType {
  alert: AlertType;
  onClick?: () => void;
}

const FirePositionMarkerMap = ({
  alert,
  onClick,
}: FirePositionMarkerMapType) => {
  const { t } = useTranslationPrefix('alerts');

  if (alert.eventSmokeLocation === undefined) {
    return null;
  }
  return (
    <Marker
      position={alert.eventSmokeLocation}
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
              {t('subtitleSmokeLocalisation')}
            </Typography>
          </div>
          <div>
            <Typography variant="caption" sx={{ mb: 0.5 }}>
              {formatPosition(...alert.eventSmokeLocation)}
            </Typography>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default FirePositionMarkerMap;
