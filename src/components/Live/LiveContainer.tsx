import { Box, Grid, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import {
  liveInstance,
  type ResponseStatus,
  STATUS_ERROR,
  STATUS_LOADING,
  STATUS_SUCCESS,
} from '../../services/axios';
import type { CameraType } from '../../services/camera';
import { type CameraInfosLive, getCamerasInfos } from '../../services/live';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';
import { Loader } from '../Common/Loader';
import { AlertLive } from './AlertLive';
import type { SiteType } from './ControlAccessLiveContainer';
import { LiveControlPanel } from './LiveControlPanel';
import { LiveStreamPanel } from './LiveStreamPanel';

interface LiveContainerProps {
  status: ResponseStatus;
  sites: SiteType[];
}

const addDatasFromSite = (
  cameras: CameraType[],
  newDataFromSite: CameraInfosLive[]
) => {
  return cameras.map((camera) => {
    const cameraFromSite = newDataFromSite.find(
      (cFromSite) => cFromSite.name == camera.name
    );
    return {
      ...camera,
      azimuth: cameraFromSite?.azimuth ?? [],
      poses: cameraFromSite?.poses ?? [],
    };
  });
};

export const LiveContainer = ({ status, sites }: LiveContainerProps) => {
  const { t } = useTranslationPrefix('live');
  const [selectedSite, setSelectedSite] = useState<SiteType | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<CameraType | null>(null);

  const { status: statusCameras } = useQuery({
    enabled: !!selectedSite,
    queryKey: ['camerasLive'],
    queryFn: () => {
      liveInstance.defaults.baseURL = `http://${selectedSite?.ip}:${import.meta.env.VITE_SITES_LIVE_PORT}`;
      void getCamerasInfos().then((camerasListFromSite) => {
        if (selectedSite) {
          setSelectedSite({
            ...selectedSite,
            cameras: addDatasFromSite(
              selectedSite.cameras,
              camerasListFromSite
            ),
          });
        }
        return camerasListFromSite;
      });
    },
  });

  useEffect(() => {
    if (sites.length > 0) {
      const newSelectedSite = sites[0];
      setSelectedSite(newSelectedSite);
      if (newSelectedSite.cameras.length > 0) {
        setSelectedCamera(newSelectedSite.cameras[0]);
      }
    }
  }, [sites]);

  return (
    <Box
      minHeight={200}
      minWidth={'80%'}
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
      }}
    >
      {status == STATUS_ERROR && ( //|| statusCameras == STATUS_ERROR) && (
        <Typography variant="body2">{t('errorFetchInfos')}</Typography>
      )}
      {(status == STATUS_LOADING || statusCameras == STATUS_LOADING) && (
        <Loader />
      )}
      {status == STATUS_SUCCESS &&
        statusCameras == STATUS_SUCCESS &&
        sites.length == 0 && (
          <Typography variant="body2">{t('errorNoAccess')}</Typography>
        )}
      {status == STATUS_SUCCESS &&
        //statusCameras == STATUS_SUCCESS &&
        sites.length != 0 &&
        selectedSite && (
          <>
            <AlertLive />
            <Grid container p={2}>
              <Grid size={8}>
                <LiveStreamPanel />
              </Grid>
              <Grid size={4}>
                <LiveControlPanel
                  sites={sites}
                  selectedSite={selectedSite}
                  setSelectedSite={setSelectedSite}
                  selectedCamera={selectedCamera}
                  setSelectedCamera={setSelectedCamera}
                />
              </Grid>
            </Grid>
          </>
        )}
    </Box>
  );
};
