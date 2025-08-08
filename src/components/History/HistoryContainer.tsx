import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';

import type { FiltersType } from '../../pages/HistoryPage.tsx';
import {
  type ResponseStatus,
  STATUS_ERROR,
  STATUS_LOADING,
  STATUS_SUCCESS,
} from '../../services/axios';
import type { AlertType } from '../../utils/alerts';
import { useIsMobile } from '../../utils/useIsMobile';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';
import { AlertContainer } from '../Alerts/AlertDetails/AlertContainer.tsx';
import { Loader } from '../Common/Loader';
import { HistoryList } from './HistoryList/HistoryList.tsx';

interface HistoryContainerType {
  status: ResponseStatus;
  alertsList: AlertType[];
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
}

export const HistoryContainer = ({
  status,
  alertsList,
  filters,
  setFilters,
}: HistoryContainerType) => {
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLElement>(null);
  const { t } = useTranslationPrefix('history');

  useEffect(() => {
    const selectedAlertIndex = alertsList.findIndex(
      (a) => a.id === selectedAlert?.id
    );
    if (isMobile && selectedAlertIndex == -1) {
      // In mobile mode, no alert is selected by default
      // If the list change and the selectedAlert doesn't exist anymore, the selectedAlert is reset
      setSelectedAlert(null);
    }
    if (!isMobile && (!selectedAlert || selectedAlertIndex == -1)) {
      // In computer mode, the first alert is selected by default
      // If the list change and the selectedAlert doesn't exist anymore, the selectedAlert is reset to the first in the list
      setSelectedAlert(alertsList.length > 0 ? alertsList[0] : null);
    }
  }, [alertsList, isMobile, selectedAlert]);

  const AlertsListComponent = (
    <HistoryList
      alerts={alertsList}
      filters={filters}
      setFilters={setFilters}
      selectedAlert={selectedAlert}
      setSelectedAlert={setSelectedAlert}
    />
  );

  const AlertDetailsComponent = selectedAlert && (
    <AlertContainer
      alert={selectedAlert}
      resetAlert={() => {
        setSelectedAlert(null);
      }}
    />
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
        <Box ref={containerRef}>
          {isMobile ? (
            <>
              <Slide
                direction={'right'}
                in={!selectedAlert}
                mountOnEnter
                unmountOnExit
                container={containerRef.current}
              >
                <Box>{AlertsListComponent}</Box>
              </Slide>
              <Slide
                direction={'left'}
                in={!!selectedAlert}
                mountOnEnter
                unmountOnExit
                container={containerRef.current}
              >
                <Box>{AlertDetailsComponent}</Box>
              </Slide>
            </>
          ) : (
            <Grid container>
              <Grid size={{ sm: 4, md: 3 }}>{AlertsListComponent}</Grid>
              <Grid size={{ sm: 8, md: 9 }}>{AlertDetailsComponent}</Grid>
            </Grid>
          )}
        </Box>
      )}
    </>
  );
};
