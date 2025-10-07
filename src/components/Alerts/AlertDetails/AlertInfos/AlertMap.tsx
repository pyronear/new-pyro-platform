import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { Box } from '@mui/material';
import L from 'leaflet';
import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

import CameraMarkerMap from '@/components/Common/Map/CameraMarkerMap';
import FirePositionMarkerMap from '@/components/Common/Map/FirePositionMarkerMap';
import { SequencePolygon } from '@/components/Common/Map/SequencePolygon';
import type { AlertType, SequenceWithCameraInfoType } from '@/utils/alerts';
import { buildVisionPolygon, DEFAULT_CAM_RANGE_KM } from '@/utils/cameraVision';

interface AlertMap {
  alert: AlertType;
  height?: number | string;
}

type SequenceWithCamera = SequenceWithCameraInfoType & {
  camera: NonNullable<SequenceWithCameraInfoType['camera']>;
};

const AlertMap = ({ alert, height = '100%' }: AlertMap) => {
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fullScreen) {
        setFullScreen(false);
      }
    };

    if (fullScreen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullScreen]);

  const sequencesWithPolygons = useMemo(() => {
    return alert.sequences
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
  }, [alert]);

  const allPolygonPoints = sequencesWithPolygons.flatMap((seq) =>
    seq.visionPolygonPoints.map((point) => [point.lat, point.lng])
  );

  return (
    <div
      key={fullScreen.toString()}
      style={
        fullScreen
          ? {
              position: 'fixed',
              zIndex: 1101,
              top: 0,
              left: 0,
              height: '100vh',
              width: '100vw',
              borderRadius: 0,
            }
          : { position: 'relative', height, width: '100%' }
      }
    >
      <MapContainer
        bounds={allPolygonPoints as L.LatLngBoundsExpression}
        key={alert.sequences.map((s) => s.id).join(',')} // map is not recentered when a new alert is shown (because bounds don't update automatically) so we use key to force a re-render
        boundsOptions={{ padding: [20, 20] }}
        style={{ height: '100%', width: '100%', borderRadius: 4 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sequencesWithPolygons.map((sequence) => {
          return (
            <div key={sequence.id}>
              <SequencePolygon
                visionPolygonPoints={sequence.visionPolygonPoints}
              />
              <CameraMarkerMap camera={sequence.camera} />
            </div>
          );
        })}
        {sequencesWithPolygons.length > 1 && (
          <FirePositionMarkerMap alert={alert} />
        )}
      </MapContainer>
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1000,
          backgroundColor: 'white',
          borderRadius: 1,
          p: 0.5,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          color: 'black',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {fullScreen ? (
          <CloseFullscreenIcon
            onClick={() => {
              setFullScreen(false);
            }}
          />
        ) : (
          <FullscreenIcon
            onClick={() => {
              setFullScreen(true);
            }}
          />
        )}
      </Box>
    </div>
  );
};

export default AlertMap;
