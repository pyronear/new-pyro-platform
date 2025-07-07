import DownloadIcon from '@mui/icons-material/Download';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import type { SequenceWithCameraInfoType } from '../../../utils/alerts';
import { formatToTime } from '../../../utils/dates';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';

interface AlertImageType {
  sequence: SequenceWithCameraInfoType;
}

export const AlertImages = ({ sequence }: AlertImageType) => {
  const { t } = useTranslationPrefix('alerts');

  return (
    <Paper sx={{ minHeight: 500, borderRadius: 6, padding: 2 }}>
      <Grid container direction="column" spacing={2}>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          minHeight={35}
        >
          <Grid>
            <Typography variant="h4">
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
        <Grid container spacing={1}>
          {/* One skeleton in place of the image, one skeleton in place of the timeline */}
          <Skeleton variant="rectangular" width="100%" height={500} />
          <Skeleton variant="rectangular" width="100%" height={80} />
        </Grid>
      </Grid>
    </Paper>
  );
};
