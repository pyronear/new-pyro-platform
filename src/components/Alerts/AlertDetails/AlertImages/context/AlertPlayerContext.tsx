import { createContext } from 'react';

import type { DetectionType } from '@/services/alerts';

export const PLAYBACK_SPEED_OPTIONS = [1, 2, 4] as const;
export type PlaybackSpeed = (typeof PLAYBACK_SPEED_OPTIONS)[number];

export interface SliderMark {
  value: number;
  id: number;
  label: string | null;
}

export interface AlertPlayerContextType {
  sequenceId: number;
  detections: DetectionType[];
  loadedCount: number;
  totalCount: number;
  isLoading: boolean;
  currentIndex: number;
  isPlaying: boolean;
  playbackSpeed: PlaybackSpeed;
  selectedDetection: DetectionType;
  marks: SliderMark[];
  step: (delta: number) => void;
  togglePlay: () => void;
  setPlaybackSpeed: (speed: PlaybackSpeed) => void;
  seekToValue: (value: number) => void;
}

export const AlertPlayerContext = createContext<
  AlertPlayerContextType | undefined
>(undefined);
