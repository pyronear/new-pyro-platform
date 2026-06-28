import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Slider,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type { DetectionType } from '@/services/alerts';
import appConfig from '@/services/appConfig';
import { convertIsoToUnix, formatIsoToTime } from '@/utils/dates';
import { useIsMobile } from '@/utils/useIsMobile';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { DetectionImageWithBoundingBox } from './DetectionImageWithBoundingBox';
import { useImagePreloader } from './useImagePreloader';

const PRELOAD_FRAMES_BACKWARD = 5;
const PRELOAD_FRAMES_FORWARD = 20;
const JUMP_FRAMES = 10;
const PLAYBACK_SPEED_OPTIONS = [1, 2, 4] as const;
type PlaybackSpeed = (typeof PLAYBACK_SPEED_OPTIONS)[number];

const ALERTS_PLAYER_INTERVAL_MILLISECONDS =
  appConfig.getConfig().ALERTS_PLAYER_INTERVAL_MILLISECONDS;

interface AlertImagesPlayerType {
  sequenceId: number;
  detections: DetectionType[]; // chronological order, oldest first
  displayBbox: boolean;
  displayCrop: boolean;
  onSelectedDetectionChange: (detection: DetectionType | null) => void;
  firstConfidentDetectionIndex: number;
  loadedCount: number;
  totalCount: number;
  isLoading: boolean;
}

export const AlertImagesPlayer = ({
  sequenceId,
  detections,
  displayBbox,
  displayCrop,
  onSelectedDetectionChange,
  firstConfidentDetectionIndex,
  loadedCount,
  totalCount,
  isLoading,
}: AlertImagesPlayerType) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<PlaybackSpeed>(1);
  const [speedAnchorEl, setSpeedAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useIsMobile();
  const { t } = useTranslationPrefix('alerts');

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
          // Stop at the end; user can scrub back manually.
          setIsPlaying(false);
          return idx;
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

  const onChangeSlider = (_event: Event, newValue: unknown) => {
    if (typeof newValue !== 'number') return;
    const targetIndex = marks.findIndex((mark) => mark.value === newValue);
    if (targetIndex >= 0) {
      setCurrentIndex(targetIndex);
    }
  };

  const speedMenuOpen = Boolean(speedAnchorEl);

  const loadProgress =
    totalCount > 0 ? Math.round((loadedCount / totalCount) * 100) : 100;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!selectedDetection) return null;

  return (
    <Stack direction="column" spacing={1} ref={rootRef}>
      <DetectionImageWithBoundingBox
        displayBbox={displayBbox}
        displayCrop={displayCrop}
        sequenceId={sequenceId}
        selectedDetection={selectedDetection}
      />

      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        useFlexGap
        sx={{ flexWrap: 'wrap', rowGap: 1 }}
      >
        <IconButton
          onClick={() => step(-JUMP_FRAMES)}
          aria-label={t('buttonJumpBackward')}
          disabled={currentIndex === 0}
          size="large"
          sx={{ border: `1px solid ${theme.palette.grey[500]}` }}
        >
          <FastRewindIcon />
        </IconButton>
        <IconButton
          onClick={() => step(-1)}
          aria-label={t('buttonStepBackward')}
          disabled={currentIndex === 0}
          size="large"
          sx={{ border: `1px solid ${theme.palette.grey[500]}` }}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
        <IconButton
          onClick={togglePlay}
          aria-label={t(isPlaying ? 'buttonPause' : 'buttonPlay')}
          size="large"
          sx={{ border: `1px solid ${theme.palette.grey[500]}` }}
        >
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <IconButton
          onClick={() => step(1)}
          aria-label={t('buttonStepForward')}
          disabled={currentIndex >= detections.length - 1}
          size="large"
          sx={{ border: `1px solid ${theme.palette.grey[500]}` }}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
        <IconButton
          onClick={() => step(JUMP_FRAMES)}
          aria-label={t('buttonJumpForward')}
          disabled={currentIndex >= detections.length - 1}
          size="large"
          sx={{ border: `1px solid ${theme.palette.grey[500]}` }}
        >
          <FastForwardIcon />
        </IconButton>
        <Button
          onClick={(event) => setSpeedAnchorEl(event.currentTarget)}
          aria-label={t('buttonPlaybackSpeed')}
          variant="outlined"
          sx={{
            minWidth: 56,
            height: 48,
            px: 1.5,
            borderRadius: '999px',
            borderColor: theme.palette.grey[500],
            color: theme.palette.text.primary,
            fontWeight: 500,
            textTransform: 'none',
          }}
        >
          {`${playbackSpeed.toString()}×`}
        </Button>
        <Menu
          anchorEl={speedAnchorEl}
          open={speedMenuOpen}
          onClose={() => setSpeedAnchorEl(null)}
        >
          {PLAYBACK_SPEED_OPTIONS.map((speed) => (
            <MenuItem
              key={speed}
              selected={speed === playbackSpeed}
              onClick={() => {
                setPlaybackSpeed(speed);
                setSpeedAnchorEl(null);
              }}
            >
              {`${speed.toString()}×`}
            </MenuItem>
          ))}
        </Menu>
        {loadedCount < totalCount &&
          (isLoading ? (
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              {t('loadingProgress', { progress: loadProgress })}
            </Typography>
          ) : (
            <Typography
              variant="body2"
              sx={{ color: theme.palette.error.main }}
            >
              {t('partialLoadError', { missing: totalCount - loadedCount })}
            </Typography>
          ))}
        <Box
          sx={{
            flexGrow: 1,
            width: isMobile ? '100%' : 'auto',
            minWidth: isMobile ? '100%' : 240,
            mr: 2,
            px: 3,
            py: 3,
          }}
        >
          <Slider
            value={convertIsoToUnix(selectedDetection.created_at)}
            onChange={onChangeSlider}
            min={marks[0].value}
            max={marks[marks.length - 1].value}
            step={null}
            valueLabelDisplay={isPlaying ? 'off' : 'on'}
            valueLabelFormat={formatIsoToTime(selectedDetection.created_at)}
            marks={marks}
            sx={{
              verticalAlign: 'middle',
              color: theme.palette.primary.light,
              '& .MuiSlider-rail': {
                height: 8,
              },
              '& .MuiSlider-track': {
                height: 8,
              },
              '& .MuiSlider-mark': {
                height: 12,
                width: 2,
                backgroundColor: theme.palette.primary.light,
                opacity: 0.32,
              },
              '& .MuiSlider-markActive': {
                opacity: 1,
              },
              '& .MuiSlider-markLabel': {
                m: 0,
                fontSize: '0.8rem',
              },
              '& .MuiSlider-valueLabel': {
                m: 0,
                backgroundColor: theme.palette.primary.light,
                fontSize: '0.8rem',
              },
            }}
          />
        </Box>
      </Stack>
    </Stack>
  );
};
