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
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLElement>(null);
  const { t } = useTranslationPrefix('alerts');

  const { playSound } = useAlertSoundToggle();

  useEffect(() => {
    if (hasNewSequence) {
      playSound();
    }
  }, [hasNewSequence, playSound]);

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
      resetAlert={() => {
        setSelectedAlert(null);
      }}
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
