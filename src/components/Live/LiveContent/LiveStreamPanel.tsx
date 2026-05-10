import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { Loader } from '@/components/Common/Loader';
import { STATUS_ERROR, STATUS_SUCCESS } from '@/services/axios';
import { type AlertType } from '@/utils/alerts';
import type { CameraFullInfosType } from '@/utils/camera';
import { calculateHasRotation, getMoveToAzimuthFromAlert } from '@/utils/live';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { useActionsOnCamera } from '../context/useActionsOnCamera';
import { StateStreaming, useMediaMtx } from '../hooks/useMediaMtx';
import { RelaunchVideoButton } from './VideoStream/RelaunchVideoButton';
import { VideoStream } from './VideoStream/VideoStream';

interface LiveStreamPanelProps {
  urlStreaming: string;
  camera: CameraFullInfosType;
  alert?: AlertType;
  setIsStreamVideoInterrupted: Dispatch<SetStateAction<boolean>>;
}

export const LiveStreamPanel = ({
  urlStreaming,
  camera,
  setIsStreamVideoInterrupted,
  alert,
}: LiveStreamPanelProps) => {
  const id = camera.id;
  const { t } = useTranslationPrefix('live');
  const refVideo = useRef<HTMLVideoElement>(null);
  const mediaMtx = useMediaMtx({ urlStreaming, refVideo, id: camera.id });
  const { addStreamingAction, isStreamingTimeout, statusStreamingVideo } =
    useActionsOnCamera();

  const initialMove = useMemo(
    () => getMoveToAzimuthFromAlert(camera, alert),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const hasTemporaryError =
    mediaMtx.state === StateStreaming.IS_STREAMING && !isStreamingTimeout;

  const restartStreaming = () => {
    mediaMtx.restart();
    addStreamingAction({
      type: 'START_STREAMING',
      id,
      params: { hasRotation, move: initialMove ?? undefined },
    });
  };

  const hasRotation = calculateHasRotation(camera.type);

  useEffect(() => {
    if (id) {
      addStreamingAction({
        type: 'START_STREAMING',
        id,
        params: { hasRotation, move: initialMove ?? undefined },
      });
    }
    return () => {
      if (id) {
        addStreamingAction({
          type: 'STOP_STREAMING',
          id,
          params: { hasRotation },
        });
      }
    };
  }, [hasRotation, initialMove, id, addStreamingAction]);

  useEffect(() => {
    setIsStreamVideoInterrupted(
      mediaMtx.state === StateStreaming.FAILED ||
        mediaMtx.state === StateStreaming.STOPPED
    );
  }, [mediaMtx, setIsStreamVideoInterrupted]);

  return (
    <Stack spacing={1} height="100%" p={2}>
      {
        /* Streaming couldn't be started with backendapi : error with no retry */
        statusStreamingVideo === STATUS_ERROR && (
          <Typography variant="body2">{t('errorNoStreaming')}</Typography>
        )
      }
      {statusStreamingVideo === STATUS_SUCCESS && (
        <>
          {
            /* Streaming has been succesfully started with backendapi but mediamtx is not yet ready */
            (mediaMtx.state === StateStreaming.IN_CREATION ||
              mediaMtx.state == StateStreaming.TEMPORARY_ERROR) && (
              <Stack spacing={4}>
                <Loader />
                <Typography variant="body2">{t('loadingVideo')}</Typography>
              </Stack>
            )
          }
          {
            /* Streaming has been succesfully started with backendapi but mediamtx has failed */
            !isStreamingTimeout && mediaMtx.state === StateStreaming.FAILED && (
              <RelaunchVideoButton
                errorMessage={t('errorFinalMediaMtx')}
                restartStreaming={restartStreaming}
              />
            )
          }
          {
            /* Streaming has been succesfully started with backendapi but mediamtx is timeout */
            isStreamingTimeout && mediaMtx.state === StateStreaming.FAILED && (
              <RelaunchVideoButton
                errorMessage={t('errorInteruptedMediaMtx')}
                restartStreaming={restartStreaming}
              />
            )
          }
        </>
      )}
      {/* Streaming has been started with backendapi and mediamtx is connected */}
      <VideoStream
        ref={refVideo}
        camera={camera}
        hasRotation={hasRotation}
        display={
          statusStreamingVideo === STATUS_SUCCESS &&
          (mediaMtx.state === StateStreaming.IS_STREAMING || hasTemporaryError)
        }
      />
    </Stack>
  );
};
