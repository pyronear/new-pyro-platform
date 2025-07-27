import { Button, Divider, Grid, Typography, useTheme } from '@mui/material';

import type { AlertType } from '../../../utils/alerts';
import { type FiltersType } from '../../../utils/history.ts';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';
import { AlertsCardsColumn } from '../../Alerts/AlertsList/AlertsCardsColumn.tsx';
import { HistoryFilters } from './HistoryFilters.tsx';

interface HistoryListType {
  isQuerySequencesEnabled: boolean;
  alerts: AlertType[];
  selectedAlert: AlertType | null;
  setSelectedAlert: (newAlertSelected: AlertType) => void;
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const HistoryList = ({
  isQuerySequencesEnabled,
  alerts,
  selectedAlert,
  setSelectedAlert,
  filters,
  setFilters,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: HistoryListType) => {
  const theme = useTheme();
  const { t } = useTranslationPrefix('history');

  return (
    <Grid
      direction="column"
      bgcolor={theme.palette.customBackground.light}
      height="100%"
    >
      <Grid minHeight="55px" padding={{ xs: 1, sm: 2 }} alignContent="center">
        <Typography variant="h2">{t('title')}</Typography>
      </Grid>
      <Divider orientation="horizontal" flexItem />
      <Grid padding={{ xs: 1, sm: 2 }}>
        <HistoryFilters filters={filters} setFilters={setFilters} />
      </Grid>
      <Divider orientation="horizontal" flexItem />
      <>
        {!isQuerySequencesEnabled && (
          <Grid flexGrow={1}>
            <Typography variant="body2">{t('noFilterMessage')}</Typography>
          </Grid>
        )}
        {isQuerySequencesEnabled &&
          (alerts.length == 0 ? (
            <Typography variant="body2">{t('noAlertsMessage')}</Typography>
          ) : (
            <Grid
              sx={{
                padding: { xs: 1, sm: 2 },
                overflowY: 'auto',
                height: 'calc(100vh - 64px -  155px)', // To get scroll on the alert cards list only (= 100% - topbar height - title height and filters)
              }}
            >
              <AlertsCardsColumn
                alerts={alerts}
                selectedAlert={selectedAlert}
                setSelectedAlert={setSelectedAlert}
                isLiveMode={false}
              >
                {hasNextPage && (
                  <Button
                    variant="contained"
                    color="primary"
                    loading={isFetchingNextPage}
                    onClick={fetchNextPage}
                  >
                    {t('loadMoreMessage')}
                  </Button>
                )}
              </AlertsCardsColumn>
            </Grid>
          ))}
      </>
    </Grid>
  );
};
