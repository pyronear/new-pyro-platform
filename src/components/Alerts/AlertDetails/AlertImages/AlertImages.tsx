import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import { AlertImagesActions } from '@/components/Alerts/AlertDetails/AlertImages/AlertImagesActions.tsx';
import { type DetectionType } from '@/services/alerts';
import type { SequenceWithCameraInfoType } from '@/utils/alerts';
import { isStrictlyAfter } from '@/utils/dates';
import { getFirstConfidentDetectionIndex } from '@/utils/detections';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { AlertPlayer } from './AlertPlayer';
import { useAllDetections } from './useAllDetections';

interface AlertImagesType {
  sequence: SequenceWithCameraInfoType;
}

export const AlertImages = ({ sequence }: AlertImagesType) => {
  const { t } = useTranslationPrefix('alerts');
  const [lastSeenAt, setLastSeenAt] = useState<string | null>(null);
  const [displayBbox, setDisplayBbox] = useState(true);
  const [displayCrop, setDisplayCrop] = useState(true);
  const [currentDetection, setCurrentDetection] =
    useState<DetectionType | null>(null);

  const {
    detections,
    isLoading,
    isError,
    hasNextPage,
    loadedCount,
    totalCount,
    invalidateAndRefreshData,
  } = useAllDetections({
    sequenceId: sequence.id,
    detectionsCount: sequence.detectionsCount,
  });

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
    setDisplayCrop(true);
  }, [sequence.id]);

  // The player needs at least one loaded page before mounting.
  const hasAnyDetection = detections.length > 0;

  return (
    <Paper sx={{ height: '100% ', borderRadius: 6, padding: 2 }}>
      <Grid container direction="column" spacing={2}>
        <AlertImagesActions
          sequence={sequence}
          detections={detections}
          currentDetection={currentDetection}
        />
        <Divider flexItem />
        {isLoading && !hasAnyDetection && (
          <Grid container spacing={1}>
            {/* One skeleton in place of the image, one skeleton in place of the timeline */}
            <Skeleton variant="rectangular" width="100%" height={400} />
            <Skeleton variant="rectangular" width="100%" height={80} />
          </Grid>
        )}
        <Grid sx={{ width: '100%' }}>
          {isError && !hasAnyDetection && (
            <Typography variant="body2">
              {t('errorFetchImagesMessage')}
            </Typography>
          )}
          {hasAnyDetection && (
            <AlertPlayer
              sequenceId={sequence.id}
              detections={detections}
              onSelectedDetectionChange={setCurrentDetection}
              firstConfidentDetectionIndex={getFirstConfidentDetectionIndex(
                detections
              )}
              loadedCount={loadedCount}
              totalCount={totalCount}
              isLoading={isLoading}
            >
              <AlertPlayer.Image
                displayBbox={displayBbox}
                displayCrop={displayCrop}
              />

              <AlertPlayer.Controls hasNextPage={hasNextPage} />
            </AlertPlayer>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};
