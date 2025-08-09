import { Divider, Grid, Typography, useTheme } from '@mui/material';

import type { AlertType } from '../../../utils/alerts';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';
import { AlertsCardsColumn } from './AlertsCardsColumn';

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
    <Grid direction="column" bgcolor={theme.palette.customBackground.light}>
      <Grid minHeight="55px" padding={{ xs: 1, sm: 2 }} alignContent="center">
        <Typography variant="h2">
          {`${alerts.length.toString()} ${alerts.length <= 1 ? t('titleListSimple') : t('titleListPlural')}`}
        </Typography>
      </Grid>
      <Divider orientation="horizontal" flexItem />
      <AlertsCardsColumn
        alerts={alerts}
        selectedAlert={selectedAlert}
        setSelectedAlert={setSelectedAlert}
      />
    </Grid>
  );
};
