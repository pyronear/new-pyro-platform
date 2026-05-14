import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
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
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { DetectionImageWithBoundingBox } from './DetectionImageWithBoundingBox';
import { useImagePreloader } from './useImagePreloader';

const PRELOAD_FRAMES_BACKWARD = 5;
const PRELOAD_FRAMES_FORWARD = 20;
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

  const stepBackward = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex((idx) => Math.max(0, idx - 1));
  }, []);

  const stepForward = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex((idx) => Math.min(detections.length - 1, idx + 1));
  }, [detections.length]);

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
    <Stack direction="column" spacing={1}>
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
          onClick={stepBackward}
          aria-label={t('buttonStepBackward')}
          disabled={currentIndex === 0}
          size="large"
          sx={{ border: `1px solid ${theme.palette.grey[500]}` }}
        >
          <SkipPreviousIcon />
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
          onClick={stepForward}
          aria-label={t('buttonStepForward')}
          disabled={currentIndex >= detections.length - 1}
          size="large"
          sx={{ border: `1px solid ${theme.palette.grey[500]}` }}
        >
          <SkipNextIcon />
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
        <Typography variant="body2" sx={{ minWidth: 110 }}>
          {`${(currentIndex + 1).toString()} / ${detections.length.toString()} · ${formatIsoToTime(selectedDetection.created_at)}`}
        </Typography>
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
        <Box sx={{ flexGrow: 1, width: '100%', mr: 2, px: 3, pt: 3 }}>
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
