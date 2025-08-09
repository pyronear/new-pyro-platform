import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';

import { STATUS_ERROR, STATUS_LOADING, STATUS_SUCCESS } from '@/services/axios';
import type { CameraFullInfosType } from '@/utils/camera';
import { calculateHasRotation, SPEEDS } from '@/utils/live';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { useMediaMtx } from '../hooks/useMediaMtx';
import { FloatingActions } from './StreamActions/FloatingActions';
import { QuickActions } from './StreamActions/QuickActions';

interface LiveStreamPanelProps {
  urlStreaming: string;
  camera: CameraFullInfosType | null;
  startStreamingVideo: (ip: string, hasRotation: boolean) => void;
  stopStreamingVideo: (ip: string, hasRotation: boolean) => void;
  statusStreamingVideo: string;
}

const DEFAULT_HEIGHT_VIDEO = 450;

export const LiveStreamPanel = ({
  urlStreaming,
  camera,
  startStreamingVideo,
  stopStreamingVideo,
  statusStreamingVideo,
}: LiveStreamPanelProps) => {
  const [speedIndex, setSpeedIndex] = useState(1);
  const ip = camera?.ip ?? '';
  const { t } = useTranslationPrefix('live');
  const refVideo = useRef<HTMLVideoElement>(null);
  const mediaMtx = useMediaMtx({ urlStreaming, refVideo, ip });

  const hasRotation = calculateHasRotation(camera?.type);

  useEffect(() => {
    if (ip) {
      startStreamingVideo(ip, hasRotation);
    }
    return () => {
      if (ip) {
        stopStreamingVideo(ip, hasRotation);
      }
    };
  }, [hasRotation, ip, startStreamingVideo, stopStreamingVideo]);

  const setNextSpeed = () =>
    setSpeedIndex((oldIndex) =>
      oldIndex === SPEEDS.length - 1 ? 0 : oldIndex + 1
    );

  return (
    <Stack spacing={1} height="100%">
      {statusStreamingVideo === STATUS_ERROR && (
        <Typography variant="body2">{t('errorNoStreaming')}</Typography>
      )}
      {mediaMtx.isInitialized && mediaMtx.hasError && (
        <Typography variant="body2">{t('errorMediaMtx')}</Typography>
      )}
      {(statusStreamingVideo === STATUS_LOADING ||
        (statusStreamingVideo === STATUS_SUCCESS &&
          !mediaMtx.isInitialized)) && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={DEFAULT_HEIGHT_VIDEO}
        />
      )}
      {statusStreamingVideo === STATUS_SUCCESS && (
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
                display: mediaMtx.isInitialized ? 'inline' : 'none',
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
