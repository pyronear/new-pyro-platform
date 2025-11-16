import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Loader } from '@/components/Common/Loader';
import { STATUS_ERROR, STATUS_LOADING, STATUS_SUCCESS } from '@/services/axios';
import { type AlertType } from '@/utils/alerts';
import type { CameraFullInfosType } from '@/utils/camera';
import {
  calculateHasRotation,
  getMoveToAzimuthFromAlert,
  SPEEDS,
} from '@/utils/live';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { useActionsOnCamera } from '../context/useActionsOnCamera';
import { StateStreaming, useMediaMtx } from '../hooks/useMediaMtx';
import { FloatingActions } from './StreamActions/FloatingActions';
import { QuickActions } from './StreamActions/QuickActions';

interface LiveStreamPanelProps {
  urlStreaming: string;
  camera: CameraFullInfosType | null;
  alert?: AlertType;
  setIsStreamVideoInterrupted: Dispatch<SetStateAction<boolean>>;
}

export const LiveStreamPanel = ({
  urlStreaming,
  camera,
  setIsStreamVideoInterrupted,
  alert,
}: LiveStreamPanelProps) => {
  const [speedIndex, setSpeedIndex] = useState(1);
  const ip = camera?.ip ?? '';
  const { t } = useTranslationPrefix('live');
  const refVideo = useRef<HTMLVideoElement>(null);
  const mediaMtx = useMediaMtx({ urlStreaming, refVideo, ip });
  const { addStreamingAction, isStreamingTimeout, statusStreamingVideo } =
    useActionsOnCamera();

  const initialMove = useMemo(
    () => getMoveToAzimuthFromAlert(camera, alert),
    [alert, camera]
  );

  const mediaMtxInterrupted =
    mediaMtx.state === StateStreaming.WITH_ERROR ||
    mediaMtx.state === StateStreaming.STOPPED;

  const restartStreaming = () => {
    mediaMtx.restart();
    addStreamingAction({
      type: 'START_STREAMING',
      ip,
      params: { hasRotation, move: initialMove ?? undefined },
    });
  };

  const hasRotation = calculateHasRotation(camera?.type);

  useEffect(() => {
    if (ip) {
      addStreamingAction({
        type: 'START_STREAMING',
        ip,
        params: { hasRotation, move: initialMove ?? undefined },
      });
    }
    return () => {
      if (ip) {
        addStreamingAction({
          type: 'STOP_STREAMING',
          ip,
          params: { hasRotation },
        });
      }
    };
  }, [hasRotation, initialMove, ip, addStreamingAction]);

  useEffect(() => {
    setIsStreamVideoInterrupted(mediaMtxInterrupted);
  }, [mediaMtxInterrupted, setIsStreamVideoInterrupted]);

  const setNextSpeed = () =>
    setSpeedIndex((oldIndex) =>
      oldIndex === SPEEDS.length - 1 ? 0 : oldIndex + 1
    );

  return (
    <Stack spacing={1} height="100%">
      {statusStreamingVideo === STATUS_ERROR && (
        <Typography variant="body2">{t('errorNoStreaming')}</Typography>
      )}
      {!isStreamingTimeout && mediaMtx.state === StateStreaming.WITH_ERROR && (
        <Stack spacing={4}>
          <Loader />
          <Typography variant="body2">{t('errorTmpMediaMtx')}</Typography>
        </Stack>
      )}
      {!isStreamingTimeout && mediaMtx.state === StateStreaming.STOPPED && (
        <Typography variant="body2">{t('errorFinalMediaMtx')}</Typography>
      )}
      {isStreamingTimeout && mediaMtxInterrupted && (
        <Stack spacing={4} alignItems="center">
          <Typography variant="body2">
            {t('errorInteruptedMediaMtx')}
          </Typography>
          <div>
            <Button variant="contained" onClick={restartStreaming}>
              {t('relaunchStreamButton')}
            </Button>
          </div>
        </Stack>
      )}
      {(statusStreamingVideo === STATUS_LOADING ||
        (statusStreamingVideo === STATUS_SUCCESS &&
          mediaMtx.state === StateStreaming.IN_CREATION)) && (
        <Stack spacing={4}>
          <Loader />
          <Typography variant="body2">{t('loadingVideo')}</Typography>
        </Stack>
      )}
      {
        <>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <video
              ref={refVideo}
              playsInline
              autoPlay
              style={{
                background: '#1e1e1e',
                width: '100%',
                height: '100%',
                display:
                  statusStreamingVideo === STATUS_SUCCESS &&
                  mediaMtx.state === StateStreaming.IS_STREAMING
                    ? 'inline'
                    : 'none',
              }}
            />
            {statusStreamingVideo === STATUS_SUCCESS &&
              mediaMtx.state === StateStreaming.IS_STREAMING && (
                <FloatingActions
                  cameraIp={ip}
                  cameraType={camera?.type}
                  speed={SPEEDS[speedIndex].speed}
                />
              )}
          </div>
          {statusStreamingVideo === STATUS_SUCCESS &&
            hasRotation &&
            mediaMtx.state === StateStreaming.IS_STREAMING && (
              <QuickActions
                cameraIp={ip}
                poses={camera.poses ?? []}
                azimuths={camera.azimuths ?? []}
                speedName={SPEEDS[speedIndex].name}
                nextSpeed={setNextSpeed}
              />
            )}
        </>
      }
    </Stack>
  );
};
