import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';

import type { AlertType } from '../../utils/alertsType';
import { AlertDetails } from './AlertDetails/AlertDetails';
import { AlertsList } from './AlertsList/AlertsList';

interface AlertsContainerType {
  alerts: AlertType[];
}

export const AlertsContainer = ({ alerts }: AlertsContainerType) => {
  useEffect(() => {
    // Reset selected alert when the list change
    // TODO : reset only if selectedAlertId no longer exist
    setSelectedAlertId(alerts.length > 0 ? alerts[0].id : null);
  }, [alerts]);

  const [selectedAlertId, setSelectedAlertId] = useState<number | null>(null);
  return (
    <Grid container>
      <Grid size={{ xs: 12, sm: 4, lg: 3 }}>
        <AlertsList
          alerts={alerts}
          selectedAlertId={selectedAlertId}
          setSelectedAlertId={setSelectedAlertId}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 8, lg: 9 }}>
        <AlertDetails
          alert={alerts.find((alert) => alert.id == selectedAlertId) ?? null}
        />
      </Grid>
    </Grid>
  );
};
