import type React from 'react';

import type { CameraType } from '@/services/camera';

import { CameraListContext } from './CameraListContext';

interface CameraListProviderProps {
  camerasList: CameraType[];
  children: React.ReactNode;
}

export const CameraListProvider = ({
  camerasList,
  children,
}: CameraListProviderProps) => {
  return <CameraListContext value={camerasList}>{children}</CameraListContext>;
};
