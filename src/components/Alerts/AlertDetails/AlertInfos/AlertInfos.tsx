import { Divider, Grid, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';

import {
  type AlertType,
  type SequenceWithCameraInfoType,
} from '@/utils/alerts';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { AlertActionButtons } from '../AlertActionButtons';
import { AlertInfosSections } from './AlertInfosSections';
import AlertMap from './AlertMap';

interface AlertInfosType {
  isLiveMode: boolean;
  invalidateAndRefreshData: () => void;
  sequence: SequenceWithCameraInfoType;
  alert: AlertType;
  isFullWidth?: boolean;
}

export const AlertInfos = ({
  isLiveMode,
  invalidateAndRefreshData,
  sequence,
  alert,
  isFullWidth = false,
}: AlertInfosType) => {
  const theme = useTheme();
  const { t } = useTranslationPrefix('alerts');

  return (
    <Paper
      sx={{
        height: '100%',
        borderRadius: 6,
        padding: 2,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      }}
    >
      <Grid container direction="column" spacing={2} height="100%">
        <Grid minHeight={35} container alignItems="center">
          <Typography variant="h2">{t('titleDetails')}</Typography>
        </Grid>

        <Divider
          flexItem
          sx={{ borderColor: theme.palette.primary.contrastText }}
        />
        <Grid
          container
          direction="column"
          justifyContent="space-between"
          flexGrow={1}
        >
          <AlertInfosSections sequence={sequence} alert={alert} />
          <Grid container flexGrow={1} minHeight={200}>
            <AlertMap alert={alert} />
          </Grid>
          <AlertActionButtons
            sequence={sequence}
            alert={alert}
            isLiveMode={isLiveMode}
            invalidateAndRefreshData={invalidateAndRefreshData}
            layout={isFullWidth ? 'inline' : 'split'}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
