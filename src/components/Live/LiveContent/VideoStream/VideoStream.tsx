import { Box, type SnackbarCloseReason } from '@mui/material';
import {
  type MouseEventHandler,
  type ReactNode,
  type Ref,
  type SyntheticEvent,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AZIMUTH_AXIS_HEIGHT_PX } from '@/components/Common/AzimuthAxis/AzimuthAxis.tsx';
import { HelperSnackbar } from '@/components/Live/LiveContent/StreamActions/HelperSnackbar.tsx';
import type { CameraFullInfosType } from '@/utils/camera';
import { LOADING_ACTION_BUTTON_TIMER_MS, MIN_ZOOM } from '@/utils/live';

import { useActionsOnCamera } from '../../context/useActionsOnCamera';
import { FloatingActions } from '../StreamActions/FloatingActions';
import { QuickActions } from '../StreamActions/QuickActions';

// Used until the stream metadata (real dimensions) is loaded
const DEFAULT_VIDEO_RATIO = 16 / 9;
const AXIS_GAP_PX = 8;

interface VideoStreamProps {
  display: boolean;
  camera: CameraFullInfosType;
  hasRotation: boolean;
  ref: Ref<HTMLVideoElement>;
  azimuthAxis: ReactNode;
}

export const VideoStream = ({
  display,
  camera,
  hasRotation,
  ref,
  azimuthAxis,
}: VideoStreamProps) => {
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [videoRatio, setVideoRatio] = useState(DEFAULT_VIDEO_RATIO);
  const [openHelper, setOpenHelper] = useState(true);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const [cursor, setCursor] = useState('cursor');
  const { addStreamingAction } = useActionsOnCamera();

  const defaultCursor = useMemo(() => {
    return display && hasRotation ? 'crosshair' : 'cursor';
  }, [display, hasRotation]);

  useEffect(() => {
    // Reinitialize zoom level
    setZoom(MIN_ZOOM);
  }, [camera.id]);

  useEffect(() => {
    setCursor(defaultCursor);
  }, [defaultCursor]);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [defaultCursor, timeoutId]);

  const onClick: MouseEventHandler<HTMLVideoElement> = (e) => {
    const video = e.currentTarget;
    const rect = video.getBoundingClientRect();
    if (rect.height && rect.width) {
      // The video is letterboxed (object-fit: contain), so compute the
      // coordinates relative to the displayed image, not the element
      const scale =
        video.videoWidth && video.videoHeight
          ? Math.min(
              rect.width / video.videoWidth,
              rect.height / video.videoHeight
            )
          : null;
      const imageWidth = scale ? video.videoWidth * scale : rect.width;
      const imageHeight = scale ? video.videoHeight * scale : rect.height;
      const offsetX = (rect.width - imageWidth) / 2;
      const offsetY = (rect.height - imageHeight) / 2;
      const x = (e.clientX - rect.left - offsetX) / imageWidth;
      const y = (e.clientY - rect.top - offsetY) / imageHeight;
      if (x < 0 || x > 1 || y < 0 || y > 1) {
        // Click on the black bars around the image
        return;
      }
      setCursor('wait');
      setTimeoutId(
        window.setTimeout(() => {
          setCursor(defaultCursor);
        }, LOADING_ACTION_BUTTON_TIMER_MS)
      );
      addStreamingAction({
        type: 'MOVE_TO_COORDINATES',
        id: camera.id,
        params: { move: { coord_x: x, coord_y: y } },
      });
    }
  };

  const handleCloseSnackbar = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenHelper(false);
  };

  const updateVideoRatio = (e: SyntheticEvent<HTMLVideoElement>) => {
    const { videoWidth, videoHeight } = e.currentTarget;
    if (videoWidth && videoHeight) {
      setVideoRatio(videoWidth / videoHeight);
    }
  };

  return (
    <>
      {/* Available space for the axis + the video, used as a size container */}
      <div
        style={{
          flexGrow: 1,
          minHeight: 0,
          containerType: 'size',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {/* Frame as wide as the displayed image, so the axis matches its edges */}
        <div
          style={{
            width: `min(100cqw, (100cqh - ${AZIMUTH_AXIS_HEIGHT_PX + AXIS_GAP_PX}px) * ${videoRatio})`,
            display: 'flex',
            flexDirection: 'column',
            gap: AXIS_GAP_PX,
          }}
        >
          <Box sx={{ visibility: display ? 'visible' : 'hidden' }}>
            {azimuthAxis}
          </Box>
          <div style={{ position: 'relative', aspectRatio: videoRatio }}>
            <video
              ref={ref}
              playsInline
              autoPlay
              onClick={hasRotation ? onClick : undefined}
              onLoadedMetadata={updateVideoRatio}
              onResize={updateVideoRatio}
              style={{
                background: '#1e1e1e',
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: display ? 'block' : 'none',
                cursor: cursor,
              }}
            />
            {display && (
              <>
                {hasRotation && (
                  <HelperSnackbar
                    open={openHelper}
                    handleClose={handleCloseSnackbar}
                  />
                )}
                <FloatingActions
                  cameraId={camera.id}
                  cameraType={camera.type}
                  zoom={zoom}
                  setZoom={setZoom}
                />
              </>
            )}
          </div>
        </div>
      </div>
      {display && (
        <QuickActions
          camera={camera}
          zoom={zoom}
          hasRotation={hasRotation}
          handleHelper={() => setOpenHelper((oldValue) => !oldValue)}
        />
      )}
    </>
  );
};
