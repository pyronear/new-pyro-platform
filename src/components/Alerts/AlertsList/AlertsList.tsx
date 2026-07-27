import MapIcon from '@mui/icons-material/Map';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import {
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';

import { LastUpdateButton } from '@/components/Common/LastUpdateButton';
import type { AlertType } from '@/utils/alerts';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { BlinkingWrapper } from '../BlinkingMode/BlinkingWrapper';
import { AlertsCardsColumn } from './AlertsCardsColumn';

interface AlertListType {
  alerts: AlertType[];
  selectedAlert: AlertType | null;
  setSelectedAlert: (newAlertSelected: AlertType) => void;
  lastUpdate: number;
  isRefreshing: boolean;
  invalidateAndRefreshData: () => void;
  changeView?: () => void;
  isDetailsView?: boolean;
}

export const AlertsList = ({
  alerts,
  selectedAlert,
  setSelectedAlert,
  lastUpdate,
  isRefreshing,
  invalidateAndRefreshData,
  changeView,
  isDetailsView = true,
}: AlertListType) => {
  const theme = useTheme();
  const { t } = useTranslationPrefix('alerts');

  return (
    <Stack bgcolor={theme.palette.customBackground.light} height="100%">
      <Stack
        minHeight="55px"
        paddingY={1}
        paddingX={{ xs: 1, sm: 2 }}
        alignItems="center"
        direction="row"
        justifyContent="space-between"
      >
        <Typography variant="h2">
          {`${alerts.length.toString()} ${alerts.length <= 1 ? t('titleListSimple') : t('titleListPlural')}`}
        </Typography>
        <Stack direction="row">
          {changeView && (
            <IconButton
              color="primary"
              onClick={changeView}
              sx={{
                ...(!isDetailsView && {
                  backgroundColor: '#bdcdcb82',
                  '&:hover': { backgroundColor: '#bdcdcb82' },
                }),
              }}
            >
              <MapIcon />
            </IconButton>
          )}
          <BlinkingWrapper hasAlert={alerts.length > 0}>
            {(onClick) => (
              <Tooltip title={t('blinkingMode.buttonBlinkingView')}>
                <IconButton onClick={onClick} color="primary">
                  <OnlinePredictionIcon fontSize="large" />
                </IconButton>
              </Tooltip>
            )}
          </BlinkingWrapper>
        </Stack>
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
