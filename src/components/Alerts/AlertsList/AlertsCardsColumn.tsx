import { Stack } from '@mui/material';
import type { ReactNode } from 'react';

import type { AlertType } from '../../../utils/alerts';
import { AlertCard } from './AlertCard';

interface AlertsCardsColumnType {
  alerts: AlertType[];
  selectedAlert: AlertType | null;
  setSelectedAlert: (newAlertSelected: AlertType) => void;
  isLiveMode: boolean;
  children?: ReactNode;
}

export const AlertsCardsColumn = ({
  alerts,
  selectedAlert,
  setSelectedAlert,
  isLiveMode,
  children = null,
}: AlertsCardsColumnType) => {
  return (
    <Stack spacing={{ xs: 1, sm: 2 }}>
      {alerts.map((alert) => (
        <AlertCard
          key={alert.id}
          alert={alert}
          isLiveMode={isLiveMode}
          isActive={alert.id == selectedAlert?.id}
          setActive={() => {
            setSelectedAlert(alert);
          }}
        />
      ))}
      {children}
    </Stack>
  );
};
