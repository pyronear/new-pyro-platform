import { Divider, Grid, Typography, useTheme } from '@mui/material';

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
    <Grid direction="column" bgcolor={theme.palette.customBackground.light}>
      <Grid minHeight="55px" padding={{ xs: 1, sm: 2 }} alignContent="center">
        <Typography variant="h2">
          {`${alerts.length.toString()} ${alerts.length <= 1 ? t('titleListSimple') : t('titleListPlural')}`}
        </Typography>
      </Grid>
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
          height: 'calc(100vh - 64px -  2 * 55px)', // To get scroll on the alert cards list only (= 100% - topbar height - title height and lastupdate)
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
    </Grid>
  );
};
