import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Box, IconButton, Slider, Stack, useTheme } from '@mui/material';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { DetectionType } from '@/services/alerts';
import appConfig from '@/services/appConfig';
import { convertIsoToUnix, formatIsoToTime } from '@/utils/dates';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { AlertOrderButton } from './AlertOrderButton';
import { DetectionImageWithBoundingBox } from './DetectionImageWithBoundingBox';

interface AlertImagesPlayerType {
  sequenceId: number;
  detections: DetectionType[]; // Sorted
  displayBbox: boolean;
  displayCrop: boolean;
  onSelectedDetectionChange: (detection: DetectionType | null) => void;
  firstConfidentDetectionIndex: number;
  orderDetectionsByDesc: boolean;
  setOrderDetectionsByDesc: Dispatch<SetStateAction<boolean>>;
}

const ALERTS_PLAYER_INTERVAL_MILLISECONDS =
  appConfig.getConfig().ALERTS_PLAYER_INTERVAL_MILLISECONDS;

export const AlertImagesPlayer = ({
  sequenceId,
  detections,
  displayBbox,
  displayCrop,
  onSelectedDetectionChange,
  firstConfidentDetectionIndex,
  orderDetectionsByDesc,
  setOrderDetectionsByDesc,
}: AlertImagesPlayerType) => {
  const [selectedDetection, setSelectedDetection] =
    useState<DetectionType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const theme = useTheme();
  const { t } = useTranslationPrefix('alerts');

  const marks = useMemo(
    () =>
      detections.map((d, i) => ({
        value: convertIsoToUnix(d.created_at),
        id: d.id,
        label:
          i == 0 || i == detections.length - 1
            ? formatIsoToTime(d.created_at)
            : null,
      })),
    [detections]
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
    onSelectedDetectionChange(newSelectedDetection);
  }, [detections, selectedDetection, onSelectedDetectionChange]);

  useEffect(() => {
    // Every time the sequence changes
    // Set the pointer on the first detection on the slider
    // And start animation
    if (detections.length > 0) {
      const minDetection = detections[0];
      setSelectedDetection(detections[firstConfidentDetectionIndex]);
      onSelectedDetectionChange(minDetection);
      setIsPlaying(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sequenceId, onSelectedDetectionChange]);

  useEffect(() => {
    // Set timer to change image
    let interval: number | null = null;
    if (isPlaying) {
      if (selectedDetection && detections.length > 0) {
        interval = window.setInterval(
          displayNextImage,
          ALERTS_PLAYER_INTERVAL_MILLISECONDS
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
        onSelectedDetectionChange(newSelectedDetection);
      }
    }
  };

  const onClickPausePlay = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  return (
    <>
      {selectedDetection && (
        <Stack direction="column" spacing={1}>
          <DetectionImageWithBoundingBox
            displayBbox={displayBbox}
            displayCrop={displayCrop}
            sequenceId={sequenceId}
            selectedDetection={selectedDetection}
          />

          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton
              onClick={onClickPausePlay}
              aria-label={t(isPlaying ? 'buttonPause' : 'buttonPlay')}
              size="large"
              sx={{ border: `1px solid ${theme.palette.grey[500]}` }}
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            <AlertOrderButton
              orderDetectionsByDesc={orderDetectionsByDesc}
              setOrderDetectionsByDesc={setOrderDetectionsByDesc}
            />
            <Box sx={{ flexGrow: 1, width: '100%', mr: 2, px: 3, pt: 3 }}>
              <Slider
                value={convertIsoToUnix(selectedDetection.created_at)}
                onChange={onChangeSlider}
                min={Math.min(...marks.map((mark) => mark.value))}
                max={Math.max(...marks.map((mark) => mark.value))}
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
      )}
    </>
  );
};
