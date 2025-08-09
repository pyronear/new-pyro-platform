import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import { STATUS_ERROR, STATUS_LOADING, STATUS_SUCCESS } from '@/services/axios';
import {
  stopPatrolThenStartStreaming,
  stopStreamingThenStartPatrol,
} from '@/services/live';
import type { CameraFullInfosType } from '@/utils/camera';
import { hasRotation } from '@/utils/live';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { FloatingActions } from './StreamActions/FloatingActions';
import { QuickActions } from './StreamActions/QuickActions';

interface SpeedCameraMove {
  speed: number;
  name: number;
}

interface LiveStreamPanelProps {
  siteName: string;
  camera: CameraFullInfosType | null;
}

const SPEEDS: SpeedCameraMove[] = [
  { name: 0.5, speed: 1 },
  { name: 1, speed: 5 },
  { name: 2, speed: 10 },
];
const HEIGHT_VIDEO = 450;

export const LiveStreamPanel = ({ siteName, camera }: LiveStreamPanelProps) => {
  const [speedIndex, setSpeedIndex] = useState(1);
  const { t } = useTranslationPrefix('live');

  const urlStreaming = `${import.meta.env.VITE_LIVE_STREAMING_URL}/${siteName}/?controls=false`;
  const cameraIp = useMemo(() => camera?.ip, [camera]);

  const { mutate: start, status: statusStart } = useMutation({
    mutationFn: (ip: string) => stopPatrolThenStartStreaming(ip),
  });

  const { mutate: stop } = useMutation({
    mutationFn: (ip: string) => stopStreamingThenStartPatrol(ip),
  });

  useEffect(() => {
    if (cameraIp) {
      start(cameraIp);
      return () => {
        if (cameraIp) {
          stop(cameraIp);
        }
      };
    }
  }, [cameraIp, start, stop]);

  return (
    <Stack spacing={1} height="100%">
      {statusStart === STATUS_ERROR && (
        <Typography variant="body2">{t('errorNoStreaming')}</Typography>
      )}
      {(statusStart === STATUS_LOADING || cameraIp == undefined) && (
        <Skeleton variant="rectangular" width="100%" height={HEIGHT_VIDEO} />
      )}
      {statusStart === STATUS_SUCCESS && cameraIp && (
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
              cameraIp={cameraIp}
              cameraType={camera?.type}
              speed={SPEEDS[speedIndex].speed}
            />
          </div>
          {hasRotation(camera?.type) && (
            <QuickActions
              cameraIp={cameraIp}
              poses={camera.poses ?? []}
              azimuths={camera.azimuths ?? []}
              speedName={SPEEDS[speedIndex].name}
              nextSpeed={() =>
                setSpeedIndex((oldIndex) =>
                  oldIndex === SPEEDS.length - 1 ? 0 : oldIndex + 1
                )
              }
            />
          )}
        </>
      )}
    </Stack>
  );
};
