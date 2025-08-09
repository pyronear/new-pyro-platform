import { Grid } from '@mui/material';

import type { AlertType } from '../../../utils/alerts';
import { AlertCard } from './AlertCard';

interface AlertsCardsColumnType {
  alerts: AlertType[];
  selectedAlert: AlertType | null;
  setSelectedAlert: (newAlertSelected: AlertType) => void;
}

export const AlertsCardsColumn = ({
  alerts,
  selectedAlert,
  setSelectedAlert,
}: AlertsCardsColumnType) => {
  return (
    <Grid
      sx={{
        padding: { xs: 1, sm: 2 },
        overflowY: 'auto',
        height: 'calc(100vh - 64px - 150px)', // To get scroll on the alert cards list only (= 100% - topbar height - title height)
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
  );
};
