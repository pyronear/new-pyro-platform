import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';

import type { AlertType } from '../../../utils/alerts';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';
import { LastUpdateButton } from '../../Common/LastUpdateButton';
import { AlertsCardsColumn } from './AlertsCardsColumn';

interface AlertListType {
  alerts: AlertType[];
  selectedAlert: AlertType | null;
  setSelectedAlert: (newAlertSelected: AlertType) => void;
  lastUpdate: number;
  isRefreshing: boolean;
  invalidateAndRefreshData: () => void;
}

export const AlertsList = ({
  alerts,
  selectedAlert,
  setSelectedAlert,
  lastUpdate,
  isRefreshing,
  invalidateAndRefreshData,
}: AlertListType) => {
  const theme = useTheme();
  const { t } = useTranslationPrefix('alerts');

  return (
    <Stack
      direction="column"
      bgcolor={theme.palette.customBackground.light}
      minHeight={0}
    >
      <Box p={{ xs: 1, sm: 2 }} alignContent="center">
        <Typography variant="h2">
          {`${alerts.length.toString()} ${alerts.length <= 1 ? t('titleListSimple') : t('titleListPlural')}`}
        </Typography>
      </Box>
      <Divider orientation="horizontal" flexItem />
      <Box px={{ xs: 1, sm: 2 }} py={1}>
        <LastUpdateButton
          lastUpdate={lastUpdate}
          onRefresh={invalidateAndRefreshData}
          isRefreshing={isRefreshing}
        />
      </Box>
      {alerts.length == 0 ? (
        <Typography variant="body2">{t('noAlertsMessage')}</Typography>
      ) : (
        <AlertsCardsColumn
          alerts={alerts}
          selectedAlert={selectedAlert}
          setSelectedAlert={setSelectedAlert}
        />
      )}
    </Stack>
  );
};
