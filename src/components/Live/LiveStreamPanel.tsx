import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import {
  STATUS_ERROR,
  STATUS_IDLE,
  STATUS_LOADING,
  STATUS_SUCCESS,
} from '@/services/axios';
import {
  startStreaming,
  stopPatrolThenStartStreaming,
  stopStreaming,
  stopStreamingThenStartPatrol,
} from '@/services/live';
import type { CameraFullInfosType } from '@/utils/camera';
import { calculateHasRotation, SPEEDS } from '@/utils/live';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { FloatingActions } from './StreamActions/FloatingActions';
import { QuickActions } from './StreamActions/QuickActions';

interface LiveStreamPanelProps {
  siteName: string;
  camera: CameraFullInfosType | null;
}

const HEIGHT_VIDEO = 450;

export const LiveStreamPanel = ({ siteName, camera }: LiveStreamPanelProps) => {
  const [speedIndex, setSpeedIndex] = useState(1);
  const { t } = useTranslationPrefix('live');
  const ip = useMemo(() => camera?.ip ?? '', [camera]);
  const hasRotation: boolean = useMemo(
    () => calculateHasRotation(camera?.type),
    [camera]
  );

  const urlStreaming = `${import.meta.env.VITE_LIVE_STREAMING_URL}/${siteName}/?controls=false`;

  const { mutate: start, status: statusStart } = useMutation({
    mutationFn: (params: { ip: string; hasRotation: boolean }) =>
      params.hasRotation
        ? stopPatrolThenStartStreaming(params.ip)
        : startStreaming(params.ip),
  });

  const { mutate: stop } = useMutation({
    mutationFn: (params: { ip: string; hasRotation: boolean }) =>
      params.hasRotation
        ? stopStreamingThenStartPatrol(params.ip)
        : stopStreaming(),
  });

  useEffect(() => {
    if (ip) {
      start({ ip, hasRotation });
    }
    return () => {
      if (ip) {
        stop({ ip, hasRotation });
      }
    };
  }, [hasRotation, ip, start, stop]);

  const setNextSpeed = () =>
    setSpeedIndex((oldIndex) =>
      oldIndex === SPEEDS.length - 1 ? 0 : oldIndex + 1
    );

  return (
    <Stack spacing={1} height="100%">
      {statusStart === STATUS_ERROR && (
        <Typography variant="body2">{t('errorNoStreaming')}</Typography>
      )}
      {(statusStart === STATUS_IDLE ||
        statusStart === STATUS_LOADING ||
        !ip) && (
        <Skeleton variant="rectangular" width="100%" height={HEIGHT_VIDEO} />
      )}
      {statusStart === STATUS_SUCCESS && (
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
              poses={camera?.poses ?? []}
              azimuths={camera?.azimuths ?? []}
              speedName={SPEEDS[speedIndex].name}
              nextSpeed={setNextSpeed}
            />
          )}
        </>
      )}
    </Stack>
  );
};
