import ImageIcon from '@mui/icons-material/Image';
import MapIcon from '@mui/icons-material/Map';
import { Stack, Tab, Tabs, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useState } from 'react';

import { AlertsMap } from '@/components/Alerts/AlertsMap/AlertsMap.tsx';
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

const TAB_DETAILS = 0;
const TAB_MAP = 1;

export const AlertsContainerForDesktop = ({
  lastUpdate,
  isRefreshing,
  invalidateAndRefreshData,
  alertsList,
  selectedAlert,
  setSelectedAlert,
  resetSelectedAlert,
}: AlertsContainerType) => {
  const theme = useTheme();
  const [indexTab, setIndexTab] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setIndexTab(newValue);
  };

  return (
    <Grid container height="100%">
      <Grid size={{ sm: 3, md: 2 }} height="100%" overflow="auto">
        <AlertsList
          alerts={alertsList}
          selectedAlert={selectedAlert}
          setSelectedAlert={setSelectedAlert}
          lastUpdate={lastUpdate}
          isRefreshing={isRefreshing}
          invalidateAndRefreshData={invalidateAndRefreshData}
        />
      </Grid>
      <Grid size={{ sm: 9, md: 10 }} height="100%" overflow="auto">
        {alertsList.length == 0 && (
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
        {alertsList.length != 0 && (
          <Stack height="100%">
            <Stack
              justifyContent="space-between"
              flexDirection={'row'}
              bgcolor={theme.palette.customBackground.light}
              borderBottom={`1px solid ${theme.palette.divider}`}
              borderLeft={`1px solid ${theme.palette.divider}`}
              p={2}
            >
              <Tabs value={indexTab} onChange={handleChange}>
                <Tab icon={<ImageIcon />} aria-label="detailsViewIcon" />
                <Tab icon={<MapIcon />} aria-label="mapIcon" />
              </Tabs>
            </Stack>
            {indexTab === TAB_MAP && (
              <Box flexGrow={1} overflow="hidden">
                <AlertsMap
                  alertsList={alertsList}
                  selectedAlert={selectedAlert}
                  setSelectedAlert={setSelectedAlert}
                />
              </Box>
            )}
            {indexTab === TAB_DETAILS && (
              <Box flexGrow={1} overflow="hidden">
                {selectedAlert && (
                  <AlertContainer
                    isLiveMode={true}
                    alert={selectedAlert}
                    resetAlert={resetSelectedAlert}
                    invalidateAndRefreshData={invalidateAndRefreshData}
                  />
                )}
              </Box>
            )}
          </Stack>
        )}
      </Grid>
    </Grid>
  );
};
