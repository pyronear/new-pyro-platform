import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { Box } from '@mui/material';
import L from 'leaflet';
import { Fragment, useEffect, useMemo, useState } from 'react';

import CameraMarker from '@/components/Common/Map/CameraMarker';
import FirePositionMarkerMap from '@/components/Common/Map/FirePositionMarkerMap';
import { SequencePolygon } from '@/components/Common/Map/SequencePolygon';
import TemplateMap from '@/components/Common/Map/TemplateMap';
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

  const bounds = useMemo(() => {
    const allPolygonPoints = sequencesWithPolygons
      .map((polygon) => polygon.visionPolygonPoints)
      .flatMap((p) => p);

    return L.latLngBounds(allPolygonPoints);
  }, [sequencesWithPolygons]);

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
      <TemplateMap bounds={bounds} showLayerControl={fullScreen}>
        {sequencesWithPolygons.map((sequence) => (
          <Fragment key={sequence.id}>
            <SequencePolygon
              visionPolygonPoints={sequence.visionPolygonPoints}
            />
            <CameraMarker camera={sequence.camera} />
          </Fragment>
        ))}
        {sequencesWithPolygons.length > 1 && (
          <FirePositionMarkerMap alert={alert} />
        )}
      </TemplateMap>
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
