import type { ReactNode } from 'react';

import type { DetectionType } from '@/services/alerts';

import { AlertPlayerControls } from './AlertPlayerControls';
import { AlertPlayerImage } from './AlertPlayerImage';
import { AlertPlayerProvider } from './context/AlertPlayerProvider';

interface AlertPlayerProps {
  sequenceId: number;
  detections: DetectionType[]; // chronological order, oldest first
  firstConfidentDetectionIndex: number;
  loadedCount: number;
  totalCount: number;
  isLoading: boolean;
  onSelectedDetectionChange: (detection: DetectionType | null) => void;
  children: ReactNode;
}

// Compound component: <AlertPlayer> owns playback state via context, and its
// `Image` / `Controls` parts read it through useAlertPlayer(). This lets the
// caller compose and arrange the parts freely without prop drilling.
export function AlertPlayer({ children, ...providerProps }: AlertPlayerProps) {
  return (
    <AlertPlayerProvider {...providerProps}>{children}</AlertPlayerProvider>
  );
}

AlertPlayer.Image = AlertPlayerImage;
AlertPlayer.Controls = AlertPlayerControls;
