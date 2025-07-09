import { Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { type CameraType, getCameraList } from '../../services/camera';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';
import { Loader } from '../Common/Loader';
import { CameraCard } from './CameraCard';

export const DashboardContainer = () => {
  const [hasErrorFetching, setHasErrorFetching] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [cameraList, setCameraList] = useState<CameraType[]>([]);
  const { t } = useTranslationPrefix('dashboard');

  useEffect(() => {
    async function fetchData() {
      const response = await getCameraList();
      setIsFetched(true);
      if (response) {
        setCameraList(response);
        setHasErrorFetching(false);
      } else {
        setHasErrorFetching(true);
        setCameraList([]);
      }
    }
    void fetchData();
  }, []);

  return (
    <>
      {!isFetched && <Loader />}
      {isFetched && hasErrorFetching && (
        <Typography variant="body2">{t('errorFetchCameraMessage')}</Typography>
      )}
      {isFetched && !hasErrorFetching && (
        <>
          {cameraList.length == 0 && (
            <Typography variant="body2">{t('noCameraMessage')}</Typography>
          )}
          {cameraList.length != 0 && (
            <Grid
              container
              spacing={3}
              padding={{ xs: 2, md: 8 }}
              paddingBottom={2}
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
