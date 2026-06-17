import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { Box } from '@mui/material';
import L from 'leaflet';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

import CameraMarker from '@/components/Common/Map/CameraMarker';
import FirePositionMarkerMap from '@/components/Common/Map/FirePositionMarkerMap';
import { SequencePolygon } from '@/components/Common/Map/SequencePolygon';
import TemplateMap from '@/components/Common/Map/TemplateMap';
import { useCameraList } from '@/context/useCameraList';
import type { CameraType } from '@/services/camera.ts';
import type { AlertType, SequenceWithCameraInfoType } from '@/utils/alerts';
import { buildVisionPolygon, DEFAULT_CAM_RANGE_KM } from '@/utils/cameraVision';

interface AlertMap {
  alert: AlertType;
  selectedSequenceId: number;
  height?: number | string;
}

type SequenceWithCamera = SequenceWithCameraInfoType & {
  camera: NonNullable<SequenceWithCameraInfoType['camera']>;
};

const AlertMap = ({ alert, selectedSequenceId, height = '100%' }: AlertMap) => {
  const [fullScreen, setFullScreen] = useState(false);
  const camerasList = useCameraList();

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
          seq.azimuth,
          seq.coneAngle,
          DEFAULT_CAM_RANGE_KM
        ),
      }));
  }, [alert]);

  const isIncludedInAlert = useCallback(
    (camera: CameraType) => {
      return sequencesWithPolygons.some(
        (sequence) => camera.id === sequence.camera.id
      );
    },
    [sequencesWithPolygons]
  );

  const bounds = useMemo(() => {
    const allPolygonPoints = sequencesWithPolygons
      .map((polygon) => polygon.visionPolygonPoints)
      .flatMap((p) => p);
    const allCameraPoints = camerasList.map(
      (camera) => [camera.lat, camera.lon] as L.LatLngExpression
    );

    return L.latLngBounds([...allPolygonPoints, ...allCameraPoints]);
  }, [camerasList, sequencesWithPolygons]);

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
              isHighlighted={sequence.id === selectedSequenceId}
              visionPolygonPoints={sequence.visionPolygonPoints}
            />
            <CameraMarker camera={sequence.camera} />
          </Fragment>
        ))}
        {camerasList
          .filter((camera) => !isIncludedInAlert(camera))
          .map((camera) => (
            <CameraMarker key={camera.id} camera={camera} variant="secondary" />
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
