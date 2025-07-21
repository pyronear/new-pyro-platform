import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';

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
    <Stack
      direction="column"
      bgcolor={theme.palette.customBackground.light}
      divider={<Divider orientation="horizontal" flexItem />}
      minHeight={0}
    >
      <Box minHeight="55px" p={3}>
        <Typography variant="h3">
          {`${alerts.length.toString()} ${alerts.length <= 1 ? t('titleListSimple') : t('titleListPlural')}`}
        </Typography>
      </Box>
      <Stack overflow={'auto'} spacing={2} p={2}>
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
    </Stack>
  );
};
