import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

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
const HEIGHT_VIDEO = 500;

export const LiveStreamPanel = ({ siteName, camera }: LiveStreamPanelProps) => {
  const [speedIndex, setSpeedIndex] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const { t } = useTranslationPrefix('live');

  const urlStreaming = `${import.meta.env.VITE_LIVE_STREAMING_URL}/${siteName}/?controls=false`;
  const cameraIp = camera?.ip;

  useEffect(() => {
    if (cameraIp) {
      setLoading(true);
      setError(false);
      stopPatrolThenStartStreaming(cameraIp)
        .catch(() => setError(true))
        .finally(() => setLoading(false));
      return () => void stopStreamingThenStartPatrol(cameraIp);
    }
  }, [cameraIp]);

  return (
    <>
      {error && (
        <Typography variant="body2">{t('errorNoStreaming')}</Typography>
      )}
      {(loading || cameraIp == undefined) && (
        <Skeleton variant="rectangular" width="100%" height={HEIGHT_VIDEO} />
      )}
      {!loading && !error && cameraIp && (
        <Stack spacing={1}>
          <div style={{ position: 'relative', height: HEIGHT_VIDEO }}>
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
              cameraType={camera.type}
              speed={SPEEDS[speedIndex].speed}
            />
          </div>
          {hasRotation(camera.type) && (
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
        </Stack>
      )}
    </>
  );
};
