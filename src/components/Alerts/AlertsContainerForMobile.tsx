import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import { useRef } from 'react';

import { type AlertType } from '@/utils/alerts';

import { AlertContainer } from './AlertDetails/AlertContainer';
import { AlertsList } from './AlertsList/AlertsList';

interface AlertsContainerType {
  lastUpdate: number;
  isRefreshing: boolean;
  invalidateAndRefreshData: () => void;
  alertsList: AlertType[];
  selectedAlert: AlertType | null;
  setSelectedAlert: (newAlert: AlertType) => void;
  resetSelectedAlert: () => void;
}

export const AlertsContainerForMobile = ({
  lastUpdate,
  isRefreshing,
  invalidateAndRefreshData,
  alertsList,
  selectedAlert,
  setSelectedAlert,
  resetSelectedAlert,
}: AlertsContainerType) => {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <Box ref={containerRef} height="100%">
      <Slide
        direction="right"
        in={!selectedAlert}
        mountOnEnter
        unmountOnExit
        container={containerRef.current}
      >
        <Box height="100%">
          <AlertsList
            alerts={alertsList}
            selectedAlert={selectedAlert}
            setSelectedAlert={setSelectedAlert}
            lastUpdate={lastUpdate}
            isRefreshing={isRefreshing}
            invalidateAndRefreshData={invalidateAndRefreshData}
          />
        </Box>
      </Slide>
      <Slide
        direction="left"
        in={!!selectedAlert}
        mountOnEnter
        unmountOnExit
        container={containerRef.current}
      >
        <Box height="100%" overflow="auto">
          {selectedAlert && (
            <AlertContainer
              isLiveMode={true}
              alert={selectedAlert}
              resetAlert={resetSelectedAlert}
              invalidateAndRefreshData={invalidateAndRefreshData}
            />
          )}
        </Box>
      </Slide>
    </Box>
  );
};
