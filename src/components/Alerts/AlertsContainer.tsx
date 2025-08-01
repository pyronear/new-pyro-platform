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
import { useIsMobile } from '../../utils/useIsMobile';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';
import { Loader } from '../Common/Loader';
import { AlertContainer } from './AlertDetails/AlertContainer';
import { AlertsList } from './AlertsList/AlertsList';

interface AlertsContainerType {
  status: ResponseStatus;
  lastUpdate: number;
  isRefreshing: boolean;
  invalidateAndRefreshData: () => void;
  alertsList: AlertType[];
}

export const AlertsContainer = ({
  status,
  lastUpdate,
  isRefreshing,
  invalidateAndRefreshData,
  alertsList,
}: AlertsContainerType) => {
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLElement>(null);
  const { t } = useTranslationPrefix('alerts');

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
    <AlertsList
      alerts={alertsList}
      selectedAlert={selectedAlert}
      setSelectedAlert={setSelectedAlert}
      lastUpdate={lastUpdate}
      isRefreshing={isRefreshing}
      invalidateAndRefreshData={invalidateAndRefreshData}
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
      {status == STATUS_SUCCESS && alertsList.length == 0 && (
        <Typography variant="body2">{t('noAlertsMessage')}</Typography>
      )}

      {status == STATUS_SUCCESS && alertsList.length != 0 && (
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
