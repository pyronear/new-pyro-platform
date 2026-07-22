import { Stack } from '@mui/material';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { DetectionType } from '@/services/alerts';
import appConfig from '@/services/appConfig';
import { convertIsoToUnix, formatIsoToTime } from '@/utils/dates';

import { useImagePreloader } from '../useImagePreloader';
import {
  AlertPlayerContext,
  type AlertPlayerContextType,
  type PlaybackSpeed,
} from './AlertPlayerContext';

const PRELOAD_FRAMES_BACKWARD = 5;
const PRELOAD_FRAMES_FORWARD = 20;

const ALERTS_PLAYER_INTERVAL_MILLISECONDS =
  appConfig.getConfig().ALERTS_PLAYER_INTERVAL_MILLISECONDS;

interface AlertPlayerProviderProps {
  sequenceId: number;
  detections: DetectionType[]; // chronological order, oldest first
  firstConfidentDetectionIndex: number;
  loadedCount: number;
  totalCount: number;
  isLoading: boolean;
  onSelectedDetectionChange: (detection: DetectionType | null) => void;
  children: ReactNode;
}

export const AlertPlayerProvider = ({
  sequenceId,
  detections,
  firstConfidentDetectionIndex,
  loadedCount,
  totalCount,
  isLoading,
  onSelectedDetectionChange,
  children,
}: AlertPlayerProviderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1);

  const selectedDetection: DetectionType | undefined = detections[currentIndex];

  const detectionUrls = useMemo(
    () => detections.map((d) => d.url),
    [detections]
  );

  useImagePreloader({
    cacheKey: sequenceId,
    urls: detectionUrls,
    currentIndex,
    framesBackward: PRELOAD_FRAMES_BACKWARD,
    framesForward: PRELOAD_FRAMES_FORWARD,
  });

  const marks = useMemo(
    () =>
      detections.map((d, i) => ({
        value: convertIsoToUnix(d.created_at),
        id: d.id,
        label:
          i === 0 || i === detections.length - 1
            ? formatIsoToTime(d.created_at)
            : null,
      })),
    [detections]
  );

  const hasAutoSeekedRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const step = useCallback(
    (delta: number) => {
      setIsPlaying(false);
      setCurrentIndex((idx) =>
        Math.min(detections.length - 1, Math.max(0, idx + delta))
      );
    },
    [detections.length]
  );

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const seekToValue = useCallback(
    (value: number) => {
      const targetIndex = marks.findIndex((mark) => mark.value === value);
      if (targetIndex >= 0) {
        setCurrentIndex(targetIndex);
      }
    },
    [marks]
  );

  useEffect(() => {
    hasAutoSeekedRef.current = false;
  }, [sequenceId]);

  // One-shot seed per sequence: jump to the first confident detection and
  // start autoplay. Subsequent page arrivals may shift the helper's index,
  // but we no longer follow them — otherwise a late page could snap the
  // playhead or force-restart playback after the user had paused.
  useEffect(() => {
    if (detections.length === 0) return;
    if (hasAutoSeekedRef.current) return;
    const targetIndex = Math.min(
      Math.max(firstConfidentDetectionIndex, 0),
      detections.length - 1
    );
    hasAutoSeekedRef.current = true;
    setCurrentIndex(targetIndex);
    setIsPlaying(true);
  }, [firstConfidentDetectionIndex, detections.length]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    onSelectedDetectionChange(selectedDetection ?? null);
  }, [selectedDetection, onSelectedDetectionChange]);

  // Autoplay loop.
  useEffect(() => {
    if (!isPlaying || detections.length === 0) return;
    const intervalMs = ALERTS_PLAYER_INTERVAL_MILLISECONDS / playbackSpeed;
    const interval = window.setInterval(() => {
      setCurrentIndex((idx) => {
        if (idx >= detections.length - 1) {
          // Relaunch player
          return 0;
        }
        return idx + 1;
      });
    }, intervalMs);
    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed, detections.length]);

  // Keyboard shortcuts. We listen in the capture phase so we run before the
  // focused control's own handler, then stop the event: this makes us the sole
  // authority for these keys (no double-handling) and keeps behavior identical
  // regardless of which control the user last clicked. The slider's native
  // arrow keys would otherwise scrub without pausing, and a focused button
  // would activate on Space.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target as HTMLElement | null;

      // Let real text fields and open popup menus keep their own key handling.
      if (
        target?.matches('textarea, [contenteditable="true"]') ||
        (target?.matches('input') &&
          (target as HTMLInputElement).type !== 'range') ||
        target?.closest('[role="menu"], [role="listbox"], [role="dialog"]')
      ) {
        return;
      }

      // Only act for the player itself or when nothing in particular is focused
      // (body) — never steal keys from other interactive controls on the page.
      const inPlayer = rootRef.current?.contains(target) ?? false;
      const noFocus =
        target === document.body || target === document.documentElement;
      if (!inPlayer && !noFocus) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          event.stopPropagation();
          step(-1);
          break;
        case 'ArrowRight':
          event.preventDefault();
          event.stopPropagation();
          step(1);
          break;
        case ' ':
          event.preventDefault();
          event.stopPropagation();
          togglePlay();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [step, togglePlay]);

  const value = useMemo<AlertPlayerContextType | undefined>(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!selectedDetection) return undefined;
    return {
      sequenceId,
      detections,
      loadedCount,
      totalCount,
      isLoading,
      currentIndex,
      isPlaying,
      playbackSpeed,
      selectedDetection,
      marks,
      step,
      togglePlay,
      setPlaybackSpeed,
      seekToValue,
    };
  }, [
    sequenceId,
    detections,
    loadedCount,
    totalCount,
    isLoading,
    currentIndex,
    isPlaying,
    playbackSpeed,
    selectedDetection,
    marks,
    step,
    togglePlay,
    seekToValue,
  ]);

  if (!value) return null;

  return (
    <AlertPlayerContext value={value}>
      <Stack direction="column" spacing={1} ref={rootRef}>
        {children}
      </Stack>
    </AlertPlayerContext>
  );
};
