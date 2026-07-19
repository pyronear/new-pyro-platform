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
import { useState } from 'react';

import { convertIsoToUnix, formatIsoToTime } from '@/utils/dates';
import { useIsMobile } from '@/utils/useIsMobile';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { PLAYBACK_SPEED_OPTIONS } from './context/AlertPlayerContext';
import { useAlertPlayer } from './context/useAlertPlayer';

const JUMP_FRAMES = 10;

export const AlertPlayerControls = () => {
  const {
    detections,
    currentIndex,
    isPlaying,
    playbackSpeed,
    selectedDetection,
    marks,
    loadedCount,
    totalCount,
    isLoading,
    step,
    togglePlay,
    setPlaybackSpeed,
    seekToValue,
  } = useAlertPlayer();

  const [speedAnchorEl, setSpeedAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useIsMobile();
  const { t } = useTranslationPrefix('alerts');

  const speedMenuOpen = Boolean(speedAnchorEl);

  const loadProgress =
    totalCount > 0 ? Math.round((loadedCount / totalCount) * 100) : 100;

  const onChangeSlider = (_event: Event, newValue: unknown) => {
    if (typeof newValue === 'number') {
      seekToValue(newValue);
    }
  };

  return (
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
          <Typography variant="body2" sx={{ color: theme.palette.error.main }}>
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
  );
};
