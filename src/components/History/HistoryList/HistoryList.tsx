import { Box, Divider, Grid, Stack, Typography, useTheme } from '@mui/material';

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
}

export const HistoryList = ({
  isQuerySequencesEnabled,
  alerts,
  selectedAlert,
  setSelectedAlert,
  filters,
  setFilters,
}: HistoryListType) => {
  const theme = useTheme();
  const { t } = useTranslationPrefix('history');

  return (
    <Stack
      direction="column"
      bgcolor={theme.palette.customBackground.light}
      minHeight={0}
      height={'100%'}
    >
      <Box p={{ xs: 1, sm: 2 }} alignContent="center">
        {' '}
        <Typography variant="h2">{t('title')}</Typography>
      </Box>
      <Divider orientation="horizontal" flexItem />
      <Grid padding={{ xs: 1, sm: 2 }}>
        <HistoryFilters filters={filters} setFilters={setFilters} />
      </Grid>
      <Divider orientation="horizontal" flexItem />
      <>
        {!isQuerySequencesEnabled && (
          <Typography variant="body2">{t('noFilterMessage')}</Typography>
        )}
        {isQuerySequencesEnabled &&
          (alerts.length == 0 ? (
            <Typography variant="body2">{t('noAlertsMessage')}</Typography>
          ) : (
            <AlertsCardsColumn
              alerts={alerts}
              selectedAlert={selectedAlert}
              setSelectedAlert={setSelectedAlert}
              isModeLive={false}
            />
          ))}
      </>
    </Stack>
  );
};
