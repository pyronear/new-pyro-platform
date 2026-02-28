import { createContext } from 'react';

import type { MovementCommand } from '@/utils/live';

export interface StreamingAction {
  type:
    | 'START_STREAMING'
    | 'STOP_STREAMING'
    | 'MOVE'
    | 'MOVE_TO_AZIMUTH'
    | 'STOP'
    | 'ZOOM';
  id: number;
  params: {
    hasRotation?: boolean;
    move?: MovementCommand;
    zoom?: number;
  };
}

interface ActionsOnCameraContextType {
  addStreamingAction: (newAction: StreamingAction) => void;
  isStreamingTimeout: boolean;
  resetErrorOnAction: () => void;
  errorStreamingAction: string | null;
  statusStreamingVideo: string;
}

export const ActionsOnCameraContext = createContext<
  ActionsOnCameraContextType | undefined
>(undefined);
