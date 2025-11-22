import { Divider, Grid, Stack, Typography, useTheme } from '@mui/material';

import { LastUpdateButton } from '@/components/Common/LastUpdateButton';
import type { AlertType } from '@/utils/alerts';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

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
    <Stack bgcolor={theme.palette.customBackground.light} height="100%">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        minHeight="55px"
        padding={{ xs: 1, sm: 2 }}
      >
        <Typography variant="h2">
          {`${alerts.length.toString()} ${alerts.length <= 1 ? t('titleListSimple') : t('titleListPlural')}`}
        </Typography>
      </Stack>
      <Divider orientation="horizontal" flexItem />
      <Grid px={{ xs: 1, sm: 2 }} py={1}>
        <LastUpdateButton
          lastUpdate={lastUpdate}
          onRefresh={invalidateAndRefreshData}
          isRefreshing={isRefreshing}
        />
      </Grid>
      <Grid
        sx={{
          padding: { xs: 1, sm: 2 },
          overflowY: 'auto',
        }}
      >
        {alerts.length == 0 ? (
          <Typography variant="body2">{t('noAlertsMessage')}</Typography>
        ) : (
          <AlertsCardsColumn
            isLiveMode={true}
            alerts={alerts}
            selectedAlert={selectedAlert}
            setSelectedAlert={setSelectedAlert}
          />
        )}
      </Grid>
    </Stack>
  );
};
