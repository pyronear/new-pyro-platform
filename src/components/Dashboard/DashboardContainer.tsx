import { Grid, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { getCameraList } from '../../services/camera';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';
import { Loader } from '../Common/Loader';
import { CameraCard } from './CameraCard';

export const DashboardContainer = () => {
  const { t } = useTranslationPrefix('dashboard');

  const {
    isPending,
    isError,
    data: cameraList,
    isSuccess,
  } = useQuery({
    queryKey: ['cameras'],
    queryFn: getCameraList,
  });

  return (
    <>
      {isPending && <Loader />}
      {isError && (
        <Typography variant="body2">{t('errorFetchCameraMessage')}</Typography>
      )}
      {isSuccess && (
        <>
          {cameraList.length == 0 && (
            <Typography variant="body2">{t('noCameraMessage')}</Typography>
          )}
          {cameraList.length != 0 && (
            <Grid
              container
              spacing={3}
              padding={{ xs: 2, md: 8 }}
              paddingBottom={{ xs: 2, md: 2 }}
            >
              {cameraList.map((camera) => (
                <Grid key={camera.id} size={{ xs: 12, md: 4, lg: 3 }}>
                  <CameraCard camera={camera} />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </>
  );
};
