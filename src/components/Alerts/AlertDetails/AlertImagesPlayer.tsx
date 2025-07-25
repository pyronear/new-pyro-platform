import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
  Box,
  Grid,
  IconButton,
  Slider,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { DetectionType } from '../../../services/alerts';
import { convertStrToEpoch, formatToTime } from '../../../utils/dates';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';

interface AlertImagesPlayerType {
  detections: DetectionType[]; // Sorted
}

const ALERTS_PLAY_INTERVAL_MILLISECONDS = import.meta.env
  .VITE_ALERTS_PLAY_INTERVAL_MILLISECONDS;

export const AlertImagesPlayer = ({ detections }: AlertImagesPlayerType) => {
  const [selectedDetection, setSelectedDetection] =
    useState<DetectionType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('xl'));
  const { t } = useTranslationPrefix('alerts');

  const marks = useMemo(
    () =>
      detections.map((d) => ({
        value: convertStrToEpoch(d.created_at),
        id: d.id,
        label: isLargeScreen ? formatToTime(d.created_at) : null,
      })),
    [detections, isLargeScreen]
  );

  const displayNextImage = useCallback(() => {
    const indexSelectedDetection = detections.findIndex(
      (d) => d.id === selectedDetection?.id
    );
    let newSelectedDetection = detections[0];
    if (indexSelectedDetection < detections.length - 1) {
      newSelectedDetection = detections[indexSelectedDetection + 1];
    }
    setSelectedDetection(newSelectedDetection);
  }, [detections, selectedDetection]);

  useEffect(() => {
    // Set the pointer on the first detection on the slider
    // And start animation
    if (detections.length > 0) {
      const minDetection = detections[0];
      setSelectedDetection(minDetection);
      setIsPlaying(true);
    }
  }, [detections]);

  useEffect(() => {
    // Set timer to change image
    let interval: number | null = null;
    if (isPlaying) {
      if (selectedDetection && detections.length > 0) {
        interval = setInterval(
          displayNextImage,
          ALERTS_PLAY_INTERVAL_MILLISECONDS
        );
      }
    }
    if (!isPlaying && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [detections.length, displayNextImage, selectedDetection, isPlaying]);

  const onChangeSlider = (_event: Event, newValue: unknown) => {
    const selectedMark = marks.find((mark) => mark.value === newValue);
    if (selectedMark) {
      const newSelectedDetection = detections.find(
        (d) => d.id === selectedMark.id
      );
      if (newSelectedDetection) {
        setSelectedDetection(newSelectedDetection);
      }
    }
  };

  const onClickPausePlay = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  return (
    <Grid container direction="column" spacing={1}>
      {selectedDetection && (
        <>
          <Grid>
            <img src={selectedDetection.url} style={{ maxWidth: '100%' }} />
          </Grid>
          <Grid container alignItems="center" spacing={2}>
            <Grid>
              <IconButton
                onClick={onClickPausePlay}
                aria-label={t(isPlaying ? 'buttonPause' : 'buttonPlay')}
                size="large"
                sx={{ border: `1px solid ${theme.palette.grey[500]}` }}
              >
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
            </Grid>
            <Grid flex={1}>
              <Box
                sx={{ width: '100%', padding: isLargeScreen ? '0 30px' : 0 }}
              >
                <Slider
                  aria-valuetext={formatToTime(selectedDetection.created_at)}
                  value={convertStrToEpoch(selectedDetection.created_at)}
                  onChange={onChangeSlider}
                  min={Math.min(...marks.map((mark) => mark.value))}
                  max={Math.max(...marks.map((mark) => mark.value))}
                  step={null}
                  valueLabelDisplay="off"
                  marks={marks}
                  sx={{
                    verticalAlign: 'middle',
                    '& .MuiSlider-markLabel': {
                      margin: 0,
                      fontSize: '0.8rem',
                    },
                  }}
                />
              </Box>
            </Grid>
            {!isLargeScreen && (
              <Grid>
                <Typography>
                  {formatToTime(selectedDetection.created_at)}
                </Typography>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </Grid>
  );
};
