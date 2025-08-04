import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';

import type { AlertType } from '../../utils/alerts';
import { useIsMobile } from '../../utils/useIsMobile';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';
import { Loader } from '../Common/Loader';
import { AlertContainer } from './AlertDetails/AlertContainer';
import { AlertsList } from './AlertsList/AlertsList';

interface AlertsContainerType {
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
  alertsList: AlertType[];
}

export const AlertsContainer = ({
  isPending,
  isError,
  isSuccess,
  alertsList,
}: AlertsContainerType) => {
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLElement>(null);
  const { t } = useTranslationPrefix('alerts');

  useEffect(() => {
    // Reset selected alert when the list change
    // TODO : reset only if selectedAlertId no longer exist
    if (!isMobile) {
      // In computer mode, the first alert is selected by default
      setSelectedAlert(alertsList.length > 0 ? alertsList[0] : null);
    }
  }, [alertsList, isMobile]);

  const AlertsListComponent = (
    <AlertsList
      alerts={alertsList}
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
      {isPending && <Loader />}
      {isError && (
        <Typography variant="body2">
          {t('errorFetchSequencesMessage')}
        </Typography>
      )}
      {isSuccess && alertsList.length == 0 && (
        <Typography variant="body2">{t('noAlertsMessage')}</Typography>
      )}

      {isSuccess && alertsList.length != 0 && (
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
