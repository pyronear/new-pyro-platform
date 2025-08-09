import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { Button, Divider, Grid, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';

import type { SequenceWithCameraInfoType } from '../../../utils/alerts';
import { formatToDateTime } from '../../../utils/dates';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';
import { AlertInfosSection } from './AlertInfosSection';
import AlertMap from './AlertMap';

interface AlertInfosType {
  sequence: SequenceWithCameraInfoType;
  sequences?: SequenceWithCameraInfoType[];
}

export const AlertInfos = ({ sequence, sequences }: AlertInfosType) => {
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
          <Grid container spacing={2} direction="column">
            <AlertInfosSection title={t('subtitleDate')}>
              {formatToDateTime(sequence.startedAt)}
            </AlertInfosSection>
            <AlertInfosSection title={t('subtitleAzimuth')}>
              {sequence.azimuth ? `${sequence.azimuth.toString()}°` : ''}
            </AlertInfosSection>
            <AlertInfosSection title={t('subtitleLocalisation')}>
              {sequence.camera?.lat && `${sequence.camera.lat.toString()}, `}
              {sequence.camera?.lon.toString()}
            </AlertInfosSection>
          </Grid>
          <Grid container flexGrow={1} minHeight={200}>
            <AlertMap sequences={sequences ?? []} />
          </Grid>
          <Grid container spacing={2} direction="column">
            <Button
              color="secondary"
              variant="outlined"
              startIcon={<SportsEsportsIcon />}
              sx={{
                '&.Mui-disabled': {
                  background: '#c6c2c2',
                  color: '#575757',
                },
              }}
              disabled
            >
              {t('buttonInvestigate')}
            </Button>
            <Button
              color="secondary"
              variant="contained"
              disabled
              sx={{
                '&.Mui-disabled': {
                  background: '#c6c2c2',
                  color: '#575757',
                },
              }}
            >
              {t('buttonTreatAlert')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
