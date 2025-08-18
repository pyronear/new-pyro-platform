import GridViewIcon from '@mui/icons-material/GridView';
import MapIcon from '@mui/icons-material/Map';
import { Box, Stack, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { useState } from 'react';

import {
  type ResponseStatus,
  STATUS_ERROR,
  STATUS_LOADING,
  STATUS_SUCCESS,
} from '../../services/axios';
import { type CameraType } from '../../services/camera';
import { useIsMobile } from '../../utils/useIsMobile';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';
import { LastUpdateButton } from '../Common/LastUpdateButton';
import { Loader } from '../Common/Loader';
import { ViewCards } from './ViewCards';
import { ViewMap } from './ViewMap';

interface DashboardContainerProps {
  status: ResponseStatus;
  lastUpdate: number;
  isRefreshing: boolean;
  invalidateAndRefreshData: () => void;
  cameraList: CameraType[] | undefined;
}

const TAB_CARDS = 0;
const TAB_MAP = 1;

export const DashboardContainer = ({
  status,
  lastUpdate,
  isRefreshing,
  invalidateAndRefreshData,
  cameraList,
}: DashboardContainerProps) => {
  const { t } = useTranslationPrefix('dashboard');
  const theme = useTheme();
  const isMobile = useIsMobile();
  const [indexTab, setIndexTab] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setIndexTab(newValue);
  };

  return (
    <>
      {status == STATUS_LOADING && <Loader />}
      {status == STATUS_ERROR && (
        <Typography variant="body2">{t('errorFetchCameraMessage')}</Typography>
      )}
      {status == STATUS_SUCCESS && cameraList && (
        <>
          {cameraList.length == 0 && (
            <Typography variant="body2">{t('noCameraMessage')}</Typography>
          )}
          {cameraList.length != 0 && (
            <Stack height="100%">
              <Stack
                justifyContent="space-between"
                flexDirection={isMobile ? 'column-reverse' : 'row'}
                bgcolor={theme.palette.customBackground.light}
                borderBottom={`1px solid ${theme.palette.divider}`}
                p={2}
              >
                <Tabs value={indexTab} onChange={handleChange}>
                  <Tab icon={<GridViewIcon />} aria-label="gridViewIcon" />
                  <Tab icon={<MapIcon />} aria-label="mapIcon" />
                </Tabs>
                <LastUpdateButton
                  lastUpdate={lastUpdate}
                  onRefresh={invalidateAndRefreshData}
                  isRefreshing={isRefreshing}
                />
              </Stack>
              {indexTab === TAB_CARDS && (
                <Box height={'100%'}>
                  <ViewCards
                    lastUpdate={lastUpdate}
                    isRefreshing={isRefreshing}
                    invalidateAndRefreshData={invalidateAndRefreshData}
                    cameraList={cameraList}
                  />
                </Box>
              )}
              {indexTab === TAB_MAP && (
                <Box height={'100%'}>
                  <ViewMap
                    lastUpdate={lastUpdate}
                    isRefreshing={isRefreshing}
                    invalidateAndRefreshData={invalidateAndRefreshData}
                    cameraList={cameraList}
                  />
                </Box>
              )}
            </Stack>
          )}
        </>
      )}
    </>
  );
};
