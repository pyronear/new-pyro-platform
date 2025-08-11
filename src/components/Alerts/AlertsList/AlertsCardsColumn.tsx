import { Stack } from '@mui/material';

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
    <Stack spacing={{ xs: 1, sm: 2 }}>
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
    </Stack>
  );
};
