import { Stack } from '@mui/material';

import type { AlertType } from '../../../utils/alerts';
import { HistoryAlertCard } from './HistoryAlertCard';

interface HistoryAlertsCardsColumnType {
  alerts: AlertType[];
  selectedAlert: AlertType | null;
  date: string; // YYYY-MM-DD format
}

export const HistoryAlertsCardsColumn = ({
  alerts,
  selectedAlert,
  date,
}: HistoryAlertsCardsColumnType) => {
  return (
    <Stack spacing={{ xs: 1, sm: 2 }}>
      {alerts.map((alert) => (
        <HistoryAlertCard
          key={alert.id}
          alert={alert}
          date={date}
          isActive={alert.id == selectedAlert?.id}
        />
      ))}
    </Stack>
  );
};
