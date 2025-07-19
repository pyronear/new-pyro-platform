import { Divider, Grid, Typography, useTheme } from '@mui/material';

import type { AlertType } from '../../../utils/alerts';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';
import { AlertCard } from './AlertCard';

interface AlertListType {
  alerts: AlertType[];
  selectedAlert: AlertType | null;
  setSelectedAlert: (newAlertSelected: AlertType) => void;
}

export const AlertsList = ({
  alerts,
  selectedAlert,
  setSelectedAlert,
}: AlertListType) => {
  const theme = useTheme();
  const { t } = useTranslationPrefix('alerts');

  return (
    <Grid direction="column" bgcolor={theme.palette.customBackground.light}>
      <Grid minHeight="55px" sx={{ padding: '1rem', paddingTop: '2rem' }}>
        <Typography variant="h3">
          {`${alerts.length.toString()} ${alerts.length <= 1 ? t('titleListSimple') : t('titleListPlural')}`}
        </Typography>
      </Grid>
      <Divider orientation="horizontal" flexItem />
      <Grid
        sx={{
          padding: '1rem',
          overflowY: 'auto',
          height: 'calc(100vh - 64px - 55px)', // To get scroll on the alert cards list only (= 100% - topbar height - title height)
        }}
      >
        <Grid container direction="column" spacing={2}>
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              isActive={alert.id == selectedAlert?.id}
              setActive={() => {
                setSelectedAlert(alert);
              }}
            />
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};
