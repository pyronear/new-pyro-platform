import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  type ResponseStatus,
  STATUS_ERROR,
  STATUS_LOADING,
  STATUS_SUCCESS,
} from '../../services/axios';
import { type AlertType, isInTheList } from '../../utils/alerts';
import { useIsMobile } from '../../utils/useIsMobile';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';
import { Loader } from '../Common/Loader';
import { AlertContainer } from './AlertDetails/AlertContainer';
import { AlertsList } from './AlertsList/AlertsList';
import { useAlertSoundToggle } from './AlertsSound/useAlertSoundToggle';

interface AlertsContainerType {
  status: ResponseStatus;
  lastUpdate: number;
  isRefreshing: boolean;
  invalidateAndRefreshData: () => void;
  alertsList: AlertType[];
  hasNewSequence: boolean;
}

export const AlertsContainer = ({
  status,
  lastUpdate,
  isRefreshing,
  invalidateAndRefreshData,
  alertsList,
  hasNewSequence,
}: AlertsContainerType) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLElement>(null);
  const { t } = useTranslationPrefix('alerts');
  const { playSound } = useAlertSoundToggle();

  const selectedAlert = useMemo(
    () =>
      alertsList.find((alert) => alert.id === searchParams.get('alert')) ??
      null,
    [alertsList, searchParams]
  );

  const setSelectedAlert = useCallback(
    (alert: AlertType) => {
      setSearchParams({ alert: alert.id });
    },
    [setSearchParams]
  );

  const resetSelectedAlert = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  useEffect(() => {
    if (hasNewSequence) {
      playSound();
    }
  }, [hasNewSequence, playSound]);

  useEffect(() => {
    // Default : initial state or if the list changes and the alert doesn't exist anymore
    if (!selectedAlert || !isInTheList(alertsList, selectedAlert)) {
      // In mobile, nothing is selected
      // In computer mode, the first in the list is selected
      if (isMobile || alertsList.length == 0) {
        resetSelectedAlert();
      } else if (alertsList.length > 0) {
        setSelectedAlert(alertsList[0]);
      }
    } else if (isInTheList(alertsList, selectedAlert)) {
      // If the selected alert has changed, its data is updated
      const indexSelectedAlert = alertsList.findIndex(
        (a) => a.id === selectedAlert.id
      );
      setSelectedAlert(alertsList[indexSelectedAlert]);
    }
  }, [
    alertsList,
    isMobile,
    resetSelectedAlert,
    selectedAlert,
    setSelectedAlert,
  ]);

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
      isLiveMode={true}
      alert={selectedAlert}
      resetAlert={resetSelectedAlert}
      invalidateAndRefreshData={invalidateAndRefreshData}
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
                <Box height={'100%'}>{AlertsListComponent}</Box>
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
              <Grid size={{ sm: 4, md: 3 }} height="100%" overflow={'auto'}>
                {AlertsListComponent}
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
