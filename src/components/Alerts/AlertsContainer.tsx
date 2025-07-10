import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';

import type { AlertType } from '../../utils/alerts';
import { AlertContainer } from './AlertDetails/AlertContainer';
import { AlertsList } from './AlertsList/AlertsList';

interface AlertsContainerType {
  alerts: AlertType[];
}

export const AlertsContainer = ({ alerts }: AlertsContainerType) => {
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);

  useEffect(() => {
    // Reset selected alert when the list change
    // TODO : reset only if selectedAlertId no longer exist
    setSelectedAlert(alerts.length > 0 ? alerts[0] : null);
  }, [alerts]);

  return (
    <Grid container>
      <Grid size={{ xs: 12, sm: 4, lg: 3 }}>
        <AlertsList
          alerts={alerts}
          selectedAlert={selectedAlert}
          setSelectedAlert={setSelectedAlert}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 8, lg: 9 }}>
        {selectedAlert && <AlertContainer alert={selectedAlert} />}
      </Grid>
    </Grid>
  );
};
