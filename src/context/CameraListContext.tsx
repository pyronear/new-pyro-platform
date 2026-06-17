import { createContext } from 'react';

import type { CameraType } from '@/services/camera';

export const CameraListContext = createContext<CameraType[] | undefined>(
  undefined
);
