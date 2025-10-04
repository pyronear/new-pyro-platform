import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Loader } from '@/components/Common/Loader';
import { STATUS_ERROR, STATUS_LOADING, STATUS_SUCCESS } from '@/services/axios';
import type { SequenceWithCameraInfoType } from '@/utils/alerts';
import type { CameraFullInfosType } from '@/utils/camera';
import {
  calculateHasRotation,
  type ControlledMove,
  getMoveToAzimuth,
  SPEEDS,
} from '@/utils/live';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { StateStreaming, useMediaMtx } from '../hooks/useMediaMtx';
import { FloatingActions } from './StreamActions/FloatingActions';
import { QuickActions } from './StreamActions/QuickActions';

interface LiveStreamPanelProps {
  urlStreaming: string;
  camera: CameraFullInfosType | null;
  startStreamingVideo: (
    ip: string,
    hasRotation: boolean,
    initialMove?: ControlledMove
  ) => void;
  stopStreamingVideo: (ip: string, hasRotation: boolean) => void;
  statusStreamingVideo: string;
  targetSequence?: SequenceWithCameraInfoType;
}

export const LiveStreamPanel = ({
  urlStreaming,
  camera,
  startStreamingVideo,
  stopStreamingVideo,
  statusStreamingVideo,
  targetSequence,
}: LiveStreamPanelProps) => {
  const [speedIndex, setSpeedIndex] = useState(1);
  const ip = camera?.ip ?? '';
  const { t } = useTranslationPrefix('live');
  const refVideo = useRef<HTMLVideoElement>(null);
  const mediaMtx = useMediaMtx({ urlStreaming, refVideo, ip });

  const hasRotation = calculateHasRotation(camera?.type);
  const initialMove = useMemo(
    () =>
      targetSequence?.coneAzimuth
        ? getMoveToAzimuth(
            targetSequence.coneAzimuth,
            camera?.azimuths ?? [],
            camera?.poses ?? []
          )
        : undefined,
    [camera?.azimuths, camera?.poses, targetSequence?.coneAzimuth]
  );

  useEffect(() => {
    if (ip) {
      startStreamingVideo(ip, hasRotation, initialMove);
    }
    return () => {
      if (ip) {
        stopStreamingVideo(ip, hasRotation);
      }
    };
  }, [hasRotation, initialMove, ip, startStreamingVideo, stopStreamingVideo]);

  const setNextSpeed = () =>
    setSpeedIndex((oldIndex) =>
      oldIndex === SPEEDS.length - 1 ? 0 : oldIndex + 1
    );

  return (
    <Stack spacing={1} height="100%">
      {statusStreamingVideo === STATUS_ERROR && (
        <Typography variant="body2">{t('errorNoStreaming')}</Typography>
      )}
      {mediaMtx.state === StateStreaming.WITH_ERROR && (
        <Stack spacing={4}>
          <Loader />
          <Typography variant="body2">{t('errorTmpMediaMtx')}</Typography>
        </Stack>
      )}
      {mediaMtx.state === StateStreaming.STOPPED && (
        <Typography variant="body2">{t('errorFinalMediaMtx')}</Typography>
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
