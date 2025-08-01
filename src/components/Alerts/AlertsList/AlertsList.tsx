import { Box, Divider, Grid, Typography, useTheme } from '@mui/material';

import type { AlertType } from '../../../utils/alerts';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';
import { LastUpdateButton } from '../../Common/LastUpdateButton';
import { AlertCard } from './AlertCard';

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
      <Box
        sx={{
          padding: { xs: 1, sm: 2 },
          overflowY: 'auto',
          height: 'calc(100vh - 64px - 55px)', // To get scroll on the alert cards list only (= 100% - topbar height - title height)
        }}
      >
        <LastUpdateButton
          lastUpdate={lastUpdate}
          onRefresh={invalidateAndRefreshData}
          isRefreshing={isRefreshing}
        />
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
      </Box>
    </Grid>
  );
};
