import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import { STATUS_ERROR, STATUS_LOADING, STATUS_SUCCESS } from '@/services/axios';
import type { CameraFullInfosType } from '@/utils/camera';
import { calculateHasRotation, SPEEDS } from '@/utils/live';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { FloatingActions } from './StreamActions/FloatingActions';
import { QuickActions } from './StreamActions/QuickActions';
import { type StreamingAction } from './useStreamingVideo';

interface LiveStreamPanelProps {
  urlStreaming: string;
  camera: CameraFullInfosType | null;
  addNewStreamingAction: (newStreamingAction: StreamingAction) => void;
  statusStreamingAction: string;
}

const HEIGHT_VIDEO = 450;

export const LiveStreamPanel = ({
  urlStreaming,
  camera,
  addNewStreamingAction,
  statusStreamingAction,
}: LiveStreamPanelProps) => {
  const [speedIndex, setSpeedIndex] = useState(1);
  const { t } = useTranslationPrefix('live');

  const ip = camera?.ip ?? '';
  const hasRotation = calculateHasRotation(camera?.type);

  useEffect(() => {
    if (ip) {
      addNewStreamingAction({ type: 'START', ip, hasRotation });
    }
    return () => {
      if (ip) {
        addNewStreamingAction({ type: 'STOP', ip, hasRotation });
      }
    };
  }, [hasRotation, ip, addNewStreamingAction]);

  const setNextSpeed = () =>
    setSpeedIndex((oldIndex) =>
      oldIndex === SPEEDS.length - 1 ? 0 : oldIndex + 1
    );

  return (
    <Stack spacing={1} height="100%">
      {statusStreamingAction === STATUS_ERROR && (
        <Typography variant="body2">{t('errorNoStreaming')}</Typography>
      )}
      {(statusStreamingAction === STATUS_LOADING || !ip) && (
        <Skeleton variant="rectangular" width="100%" height={HEIGHT_VIDEO} />
      )}
      {statusStreamingAction === STATUS_SUCCESS && (
        <>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <iframe
              height="100%"
              width="100%"
              src={urlStreaming}
              sandbox="allow-scripts"
              style={{
                border: 0,
              }}
            />
            <FloatingActions
              cameraIp={ip}
              cameraType={camera?.type}
              speed={SPEEDS[speedIndex].speed}
            />
          </div>
          {hasRotation && (
            <QuickActions
              cameraIp={ip}
              poses={camera.poses ?? []}
              azimuths={camera.azimuths ?? []}
              speedName={SPEEDS[speedIndex].name}
              nextSpeed={setNextSpeed}
            />
          )}
        </>
      )}
    </Stack>
  );
};
