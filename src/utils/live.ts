const TYPE_PTZ = 'ptz';

export const hasZoom = (cameraType: string | undefined) => {
  return cameraType === TYPE_PTZ;
};

export const hasRotation = (cameraType: string | undefined) => {
  return cameraType === TYPE_PTZ;
};
