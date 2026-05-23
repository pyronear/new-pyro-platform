import { use } from 'react';

import { CameraListContext } from './CameraListContext';

export const useCameraList = () => {
  const context = use(CameraListContext);
  if (!context) {
    throw new Error('useCameraList must be used within CameraListProvider');
  }
  return context;
};
