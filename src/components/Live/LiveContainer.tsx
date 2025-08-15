import { Grid, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import {
  liveInstance,
  STATUS_ERROR,
  STATUS_LOADING,
  STATUS_SUCCESS,
} from '../../services/axios';
import type { CameraType } from '../../services/camera';
import { type CameraInfosLive, getCamerasInfos } from '../../services/live';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';
import { Loader } from '../Common/Loader';
import { AlertLive } from './AlertLive';
import { LiveControlPanel } from './LiveControlPanel';
import { LiveStreamPanel } from './LiveStreamPanel';
import { type SiteType, useDataLive } from './useDataLive';

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

interface LiveContainerProps {
  onClose: () => void;
}

export const LiveContainer = ({ onClose }: LiveContainerProps) => {
  const { t } = useTranslationPrefix('live');
  const { status, sites } = useDataLive();
  const [selectedSite, setSelectedSite] = useState<SiteType | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<CameraType | null>(null);

  // TODO : retrieve these data from backend api
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
    <>
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
            <AlertLive onClose={onClose} />
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
    </>
  );
};
