import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slide from '@mui/material/Slide';
import { useEffect, useRef, useState } from 'react';

import type { AlertType } from '../../utils/alerts';
import { useIsMobile } from '../../utils/useIsMobile';
import { AlertContainer } from './AlertDetails/AlertContainer';
import { AlertsList } from './AlertsList/AlertsList';

interface AlertsContainerType {
  alerts: AlertType[];
}

export const AlertsContainer = ({ alerts }: AlertsContainerType) => {
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Reset selected alert when the list change
    // TODO : reset only if selectedAlertId no longer exist
    if (!isMobile) {
      // In computer mode, the first alert is selected by default
      setSelectedAlert(alerts.length > 0 ? alerts[0] : null);
    }
  }, [alerts, isMobile]);

  const AlertsListComponent = (
    <AlertsList
      alerts={alerts}
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
  );
};
