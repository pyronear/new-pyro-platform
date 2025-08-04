import DownloadIcon from '@mui/icons-material/Download';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';

import { getDetectionsBySequence } from '../../../services/alerts';
import type { SequenceWithCameraInfoType } from '../../../utils/alerts';
import { formatToTime } from '../../../utils/dates';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';
import { AlertImagesPlayer } from './AlertImagesPlayer';

interface AlertImagesType {
  sequence: SequenceWithCameraInfoType;
}

export const AlertImages = ({ sequence }: AlertImagesType) => {
  const { t } = useTranslationPrefix('alerts');

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

  return (
    <Paper sx={{ height: '100% ', borderRadius: 6, padding: 2 }}>
      <Grid container direction="column" spacing={2}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          minHeight={35}
        >
          <Grid>
            <Typography variant="h2">
              {formatToTime(sequence.startedAt)}
            </Typography>
          </Grid>
          <Grid>
            <Button disabled startIcon={<DownloadIcon />} variant="outlined">
              {t('buttonImageDownload')}
            </Button>
          </Grid>
        </Grid>
        <Divider flexItem />
        {isPending && (
          <Grid container spacing={1}>
            {/* One skeleton in place of the image, one skeleton in place of the timeline */}
            <Skeleton variant="rectangular" width="100%" height={400} />
            <Skeleton variant="rectangular" width="100%" height={80} />
          </Grid>
        )}
        <Grid>
          {isError && (
            <Typography variant="body2">
              {t('errorFetchImagesMessage')}
            </Typography>
          )}
          {isSuccess && <AlertImagesPlayer detections={detectionsList} />}
        </Grid>
      </Grid>
    </Paper>
  );
};
