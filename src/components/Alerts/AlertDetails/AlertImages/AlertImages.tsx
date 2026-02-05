import { Visibility, VisibilityOff } from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';

import {
  SplitButton,
  type SplitButtonOption,
} from '@/components/Common/SplitButton';
import { type DetectionType, getDetectionsBySequence } from '@/services/alerts';
import type { SequenceWithCameraInfoType } from '@/utils/alerts';
import { formatIsoToTime, isStrictlyAfter } from '@/utils/dates';
import { getFirstConfidentDetectionIndex } from '@/utils/detections';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { AlertImagesPlayer } from './AlertImagesPlayer';

interface AlertImagesType {
  sequence: SequenceWithCameraInfoType;
}

export const AlertImages = ({ sequence }: AlertImagesType) => {
  const { t } = useTranslationPrefix('alerts');
  const [lastSeenAt, setLastSeenAt] = useState<string | null>(null);
  const [displayBbox, setDisplayBbox] = useState(true);
  const [currentDetection, setCurrentDetection] =
    useState<DetectionType | null>(null);
  const queryClient = useQueryClient();

  const {
    isPending,
    isError,
    isSuccess,
    data: detectionsList,
  } = useQuery({
    queryKey: ['detections', sequence.id],
    queryFn: async () => {
      return await getDetectionsBySequence(sequence.id);
    },
    refetchOnWindowFocus: false,
  });

  const invalidateAndRefreshData = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['detections'] });
  }, [queryClient]);

  useEffect(() => {
    const newLastSeenAt = sequence.lastSeenAt;
    if (
      lastSeenAt &&
      newLastSeenAt &&
      isStrictlyAfter(lastSeenAt, newLastSeenAt)
    ) {
      // LastSeenAt has changed since last time
      // Detections must be refreshed
      invalidateAndRefreshData();
    }
    setLastSeenAt(newLastSeenAt);
  }, [invalidateAndRefreshData, lastSeenAt, sequence.lastSeenAt]);

  useEffect(() => {
    // Reset bbox state when the sequence changes
    setDisplayBbox(true);
  }, [sequence.id]);

  const downloadCurrentImage = () => {
    if (currentDetection) {
      const link = document.createElement('a');
      link.href = currentDetection.url;
      link.download = 'true';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadOptions: SplitButtonOption[] = [
    {
      label: t('buttonImageDownloadOne'),
      onClick: downloadCurrentImage,
    },
    {
      label: t('buttonImageDownloadAll'),
      onClick: undefined,
      disabled: true,
    },
  ];

  return (
    <Paper sx={{ height: '100% ', borderRadius: 6, padding: 2 }}>
      <Grid container direction="column" spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={{ xs: 1, sm: 2 }}
          minHeight={35}
          useFlexGap
          sx={{ flexWrap: 'wrap', rowGap: 1 }}
        >
          <Typography variant="h2">
            {formatIsoToTime(sequence.startedAt)}
          </Typography>
          <Stack
            spacing={{ xs: 1, sm: 2 }}
            alignItems="center"
            direction="row"
            useFlexGap
            sx={{ flexWrap: 'wrap', rowGap: 1 }}
          >
            <Button
              variant="outlined"
              onClick={() => setDisplayBbox((oldValue) => !oldValue)}
              startIcon={displayBbox ? <VisibilityOff /> : <Visibility />}
            >
              {displayBbox ? t('buttonHideBBox') : t('buttonDisplayBBox')}
            </Button>
            <SplitButton
              label={t('buttonImageDownload')}
              options={downloadOptions}
              startIcon={<DownloadIcon />}
              variant="outlined"
            />
          </Stack>
        </Stack>

        <Divider flexItem />
        {isPending && (
          <Grid container spacing={1}>
            {/* One skeleton in place of the image, one skeleton in place of the timeline */}
            <Skeleton variant="rectangular" width="100%" height={400} />
            <Skeleton variant="rectangular" width="100%" height={80} />
          </Grid>
        )}
        <Grid sx={{ width: '100%' }}>
          {isError && (
            <Typography variant="body2">
              {t('errorFetchImagesMessage')}
            </Typography>
          )}
          {isSuccess && (
            <AlertImagesPlayer
              sequenceId={sequence.id}
              detections={detectionsList}
              displayBbox={displayBbox}
              onSelectedDetectionChange={setCurrentDetection}
              firstConfidentDetectionIndex={getFirstConfidentDetectionIndex(
                detectionsList
              )}
            />
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};
