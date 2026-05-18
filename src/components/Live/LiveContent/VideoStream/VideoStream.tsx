import { type Ref, useState } from 'react';

import type { CameraFullInfosType } from '@/utils/camera';
import { SPEEDS } from '@/utils/live';

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
          style={{
            background: '#1e1e1e',
            width: '100%',
            height: '100%',
            display: display ? 'inline' : 'none',
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
