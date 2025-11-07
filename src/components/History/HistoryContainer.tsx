import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';

import {
  type ResponseStatus,
  STATUS_ERROR,
  STATUS_LOADING,
  STATUS_SUCCESS,
} from '../../services/axios';
import type { AlertType } from '../../utils/alerts';
import type { FiltersType } from '../../utils/history.ts';
import { useIsMobile } from '../../utils/useIsMobile';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';
import { AlertContainer } from '../Alerts/AlertDetails/AlertContainer.tsx';
import { Loader } from '../Common/Loader';
import { HistoryList } from './HistoryList/HistoryList.tsx';

interface HistoryContainerType {
  isQuerySequencesEnabled: boolean;
  status: ResponseStatus;
  alertsList: AlertType[];
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  invalidateAndRefreshData: () => void;
}

export const HistoryContainer = ({
  isQuerySequencesEnabled,
  status,
  alertsList,
  filters,
  setFilters,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  invalidateAndRefreshData,
}: HistoryContainerType) => {
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLElement>(null);
  const { t } = useTranslationPrefix('history');

  useEffect(() => {
    const indexSelectedAlert = alertsList.findIndex(
      (a) => a.id === selectedAlert?.id
    );
    if (!selectedAlert || indexSelectedAlert == -1) {
      // Default : initial state or if the list changes and the alert doesn't exist anymore
      // In mobile, nothing is selected
      // In computer mode, the first in the list is selected
      if (isMobile) {
        setSelectedAlert(null);
      } else {
        setSelectedAlert(alertsList.length > 0 ? alertsList[0] : null);
      }
    } else if (indexSelectedAlert != -1) {
      // If the selected alert has changed, its data is updated
      setSelectedAlert(alertsList[indexSelectedAlert]);
    }
  }, [alertsList, isMobile, selectedAlert]);

  const HistoryListComponent = (
    <HistoryList
      isQuerySequencesEnabled={isQuerySequencesEnabled}
      alerts={alertsList}
      filters={filters}
      setFilters={setFilters}
      selectedAlert={selectedAlert}
      setSelectedAlert={setSelectedAlert}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
    />
  );

  const AlertDetailsComponent = selectedAlert ? (
    <AlertContainer
      isLiveMode={false}
      alert={selectedAlert}
      resetAlert={() => {
        setSelectedAlert(null);
      }}
      invalidateAndRefreshData={invalidateAndRefreshData}
    />
  ) : (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <img
        src="src/assets/small-logo.png"
        style={{ maxWidth: '200px' }}
        alt="No alert selected"
      />
    </Box>
  );

  return (
    <>
      {status == STATUS_LOADING && <Loader />}
      {status == STATUS_ERROR && (
        <Typography variant="body2">
          {t('errorFetchSequencesMessage')}
        </Typography>
      )}
      {status == STATUS_SUCCESS && (
        <>
          {isMobile ? (
            <Box ref={containerRef} height={'100%'}>
              <Slide
                direction={'right'}
                in={!selectedAlert}
                mountOnEnter
                unmountOnExit
                container={containerRef.current}
              >
                <Box height={'100%'}>{HistoryListComponent}</Box>
              </Slide>
              <Slide
                direction={'left'}
                in={!!selectedAlert}
                mountOnEnter
                unmountOnExit
                container={containerRef.current}
              >
                <Box height={'100%'} overflow={'auto'}>
                  {AlertDetailsComponent}
                </Box>
              </Slide>
            </Box>
          ) : (
            <Grid container height="100%">
              <Grid size={{ sm: 4, md: 3 }} height="100%">
                {HistoryListComponent}
              </Grid>
              <Grid size={{ sm: 8, md: 9 }} height={'100%'} overflow={'auto'}>
                {AlertDetailsComponent}
              </Grid>
            </Grid>
          )}
        </>
      )}
    </>
  );
};
