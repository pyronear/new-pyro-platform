import {
  type MouseEventHandler,
  type Ref,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { CameraFullInfosType } from '@/utils/camera';
import { LOADING_ACTION_BUTTON_TIMER_MS, SPEEDS } from '@/utils/live';

import { useActionsOnCamera } from '../../context/useActionsOnCamera';
import { FloatingActions } from '../StreamActions/FloatingActions';
import { QuickActions } from '../StreamActions/QuickActions';

interface VideoStreamProps {
  display: boolean;
  camera: CameraFullInfosType;
  hasRotation: boolean;
  ref: Ref<HTMLVideoElement>;
}

export const VideoStream = ({
  display,
  camera,
  hasRotation,
  ref,
}: VideoStreamProps) => {
  const [speedIndex, setSpeedIndex] = useState(1);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const [cursor, setCursor] = useState('cursor');
  const { addStreamingAction } = useActionsOnCamera();

  const defaultCursor = useMemo(() => {
    return display && hasRotation ? 'crosshair' : 'cursor';
  }, [display, hasRotation]);

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
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.height && rect.width) {
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
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

  const setNextSpeed = () =>
    setSpeedIndex((oldIndex) =>
      oldIndex === SPEEDS.length - 1 ? 0 : oldIndex + 1
    );

  return (
    <>
      <div style={{ position: 'relative', flexGrow: 1 }}>
        <video
          ref={ref}
          playsInline
          autoPlay
          onClick={hasRotation ? onClick : undefined}
          style={{
            background: '#1e1e1e',
            width: '100%',
            height: '100%',
            display: display ? 'inline' : 'none',
            cursor: cursor,
          }}
        />
        {display && (
          <FloatingActions
            cameraId={camera.id}
            cameraType={camera.type}
            speed={SPEEDS[speedIndex].speed}
          />
        )}
      </div>
      {display && hasRotation && (
        <QuickActions
          cameraId={camera.id}
          poses={camera.poses ?? []}
          speedName={SPEEDS[speedIndex].name}
          nextSpeed={setNextSpeed}
        />
      )}
    </>
  );
};
