const TYPE_PTZ = 'ptz';

export const calculateHasZoom = (cameraType: string | undefined) => {
  return cameraType === TYPE_PTZ;
};

export const calculateHasRotation = (cameraType: string | undefined) => {
  return cameraType === TYPE_PTZ;
};

interface SpeedCameraMove {
  speed: number;
  name: number;
}

export const SPEEDS: SpeedCameraMove[] = [
  { name: 0.5, speed: 1 },
  { name: 1, speed: 5 },
  { name: 2, speed: 10 },
];
