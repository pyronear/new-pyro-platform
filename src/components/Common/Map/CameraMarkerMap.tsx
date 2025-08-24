import Typography from '@mui/material/Typography';
import { Marker as LeafletMarker } from 'leaflet';
import type { RefObject } from 'react';
import { Marker, Popup } from 'react-leaflet';

import type { CameraType } from '../../../services/camera';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';
import { cameraIcon } from './Icons';

interface CameraMarkerMapType {
  camera: CameraType;
  markerRefs?: RefObject<Map<number, LeafletMarker>>;
  onClick?: () => void;
}

const CameraMarkerMap = ({
  camera,
  markerRefs,
  onClick,
}: CameraMarkerMapType) => {
  const { t } = useTranslationPrefix('alerts');
  return (
    <Marker
      position={[camera.lat, camera.lon]}
      icon={cameraIcon}
      ref={(m) => {
        if (markerRefs === undefined) return;
        if (m) markerRefs.current.set(camera.id, m);
        else markerRefs.current.delete(camera.id);
      }}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Popup>
        <div>
          <div>
            <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 1 }}>
              {camera.name}
            </Typography>
          </div>

          <div>
            <Typography variant="caption" sx={{ mb: 0.5 }}>
              {t('mapElevation')}: {camera.elevation}m
            </Typography>
          </div>
          <div>
            <Typography variant="caption" sx={{ mb: 0.5 }}>
              {t('mapAngleOfView')}: {camera.angle_of_view}°
            </Typography>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default CameraMarkerMap;
