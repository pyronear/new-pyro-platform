import { Divider, Grid, Typography, useTheme } from '@mui/material';

import type { AlertType } from '../../../utils/alertsType';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';
import { AlertCard } from './AlertCard';

interface AlertListType {
  alerts: AlertType[];
  selectedAlertId: number | null;
  setSelectedAlertId: (id: number) => void;
}

export const AlertsList = ({
  alerts,
  selectedAlertId,
  setSelectedAlertId,
}: AlertListType) => {
  const theme = useTheme();
  const { t } = useTranslationPrefix('alerts');

  return (
    <Grid direction="column" bgcolor={theme.palette.customBackground.light}>
      <Grid height="60px">
        <Typography variant="h3" sx={{ padding: '1rem' }}>
          {`${alerts.length.toString()} ${alerts.length < 1 ? t('titleListSimple') : t('titleListPlural')}`}
        </Typography>
      </Grid>
      <Divider orientation="horizontal" flexItem />
      <Grid
        sx={{
          padding: '1rem',
          overflowY: 'auto',
          height: 'calc(100vh - 125px)',
        }}
      >
        <Grid container direction="column" spacing={2}>
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              isActive={selectedAlertId == alert.id}
              setActive={() => {
                setSelectedAlertId(alert.id);
              }}
            />
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};
