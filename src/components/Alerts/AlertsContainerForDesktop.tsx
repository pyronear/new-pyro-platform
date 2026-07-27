import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { type AlertType } from '@/utils/alerts';

import { AlertContainer } from './AlertDetails/AlertContainer';
import { AlertsList } from './AlertsList/AlertsList';
import { PyronearForestWatch } from './PyronearForestWatch';

interface AlertsContainerType {
  lastUpdate: number;
  isRefreshing: boolean;
  invalidateAndRefreshData: () => void;
  alertsList: AlertType[];
  selectedAlert: AlertType | null;
  setSelectedAlert: (newAlert: AlertType) => void;
  resetSelectedAlert: () => void;
}

export const AlertsContainerForDesktop = ({
  lastUpdate,
  isRefreshing,
  invalidateAndRefreshData,
  alertsList,
  selectedAlert,
  setSelectedAlert,
  resetSelectedAlert,
}: AlertsContainerType) => {
  return (
    <Grid container height="100%">
      <Grid size={{ sm: 3, md: 2 }} height="100%" overflow={'auto'}>
        <AlertsList
          alerts={alertsList}
          selectedAlert={selectedAlert}
          setSelectedAlert={setSelectedAlert}
          lastUpdate={lastUpdate}
          isRefreshing={isRefreshing}
          invalidateAndRefreshData={invalidateAndRefreshData}
        />
      </Grid>
      <Grid size={{ sm: 9, md: 10 }} height={'100%'} overflow={'auto'}>
        {selectedAlert ? (
          <AlertContainer
            isLiveMode={true}
            alert={selectedAlert}
            resetAlert={resetSelectedAlert}
            invalidateAndRefreshData={invalidateAndRefreshData}
          />
        ) : (
          <Box
            height="100%"
            width="100%"
            display="flex"
            alignItems="stretch"
            justifyContent="stretch"
          >
            <PyronearForestWatch
              style={{ width: '100%', height: '100%', display: 'flex' }}
            />
          </Box>
        )}
      </Grid>
    </Grid>
  );
};
