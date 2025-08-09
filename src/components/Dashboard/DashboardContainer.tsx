import { Grid, Typography } from '@mui/material';

import {
  type ResponseStatus,
  STATUS_ERROR,
  STATUS_LOADING,
  STATUS_SUCCESS,
} from '../../services/axios';
import { type CameraType } from '../../services/camera';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';
import { LastUpdateButton } from '../Common/LastUpdateButton';
import { Loader } from '../Common/Loader';
import { CameraCard } from './CameraCard';

interface DashboardContainerProps {
  status: ResponseStatus;
  lastUpdate: number;
  isRefreshing: boolean;
  invalidateAndRefreshData: () => void;
  cameraList: CameraType[] | undefined;
}
export const DashboardContainer = ({
  status,
  lastUpdate,
  isRefreshing,
  invalidateAndRefreshData,
  cameraList,
}: DashboardContainerProps) => {
  const { t } = useTranslationPrefix('dashboard');

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
            <Grid
              container
              direction="column"
              spacing={2}
              padding={{ xs: 2, md: 7 }}
              paddingBottom={{ xs: 2, md: 2 }}
            >
              <Grid>
                <LastUpdateButton
                  lastUpdate={lastUpdate}
                  onRefresh={invalidateAndRefreshData}
                  isRefreshing={isRefreshing}
                />
              </Grid>
              <Grid container spacing={3}>
                {cameraList.map((camera) => (
                  <Grid key={camera.id} size={{ xs: 12, md: 4, lg: 3 }}>
                    <CameraCard camera={camera} />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
        </>
      )}
    </>
  );
};
