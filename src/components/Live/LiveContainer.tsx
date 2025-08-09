import { Grid, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import {
  liveInstance,
  STATUS_ERROR,
  STATUS_LOADING,
  STATUS_SUCCESS,
} from '@/services/axios';
import type { CameraType } from '@/services/camera';
import { type CameraInfosLive, getCamerasInfos } from '@/services/live';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { Loader } from '../Common/Loader';
import { LiveControlPanel } from './LiveControlPanel';
import { LiveStreamPanel } from './LiveStreamPanel';
import { type SiteType, useDataLive } from './useDataLive';
import { WarningCounter } from './WarningCounter';

const aggregateDataFromCamera = (
  camera: CameraType,
  newDataFromSite: CameraInfosLive[]
) => {
  const cameraFromSite = newDataFromSite.find(
    (cFromSite) => cFromSite.name == camera.name
  );
  return {
    ...camera,
    azimuths: cameraFromSite?.azimuths ?? [],
    poses: cameraFromSite?.poses ?? [],
  };
};

interface LiveContainerProps {
  onClose: () => void;
  targetCameraName: string;
}

export const LiveContainer = ({
  onClose,
  targetCameraName,
}: LiveContainerProps) => {
  const { t } = useTranslationPrefix('live');
  const { status, sites } = useDataLive();
  const [selectedSite, setSelectedSite] = useState<SiteType | null>(null);
  const [selectedCameraId, setSelectedCameraId] = useState<number | null>(null);
  const isQueryCamerasEnabled = !!selectedSite;

  useEffect(() => {
    if (selectedSite == null && sites.length > 0) {
      // Select by default target camera and its site
      const newSelectedSite: SiteType =
        sites.find((s) =>
          s.cameras.map((c) => c.name).includes(targetCameraName)
        ) ?? sites[0];
      const newSelectedCameraId =
        newSelectedSite.cameras.find((c) => c.name == targetCameraName)?.id ??
        (newSelectedSite.cameras.length > 0
          ? newSelectedSite.cameras[0].id
          : null);
      setSelectedSite(newSelectedSite);
      setSelectedCameraId(newSelectedCameraId);
    }
  }, [selectedSite, sites, targetCameraName]);

  // TODO : retrieve these data from backend api
  const { status: statusCameras } = useQuery({
    enabled: isQueryCamerasEnabled,
    queryKey: ['camerasLive', selectedSite?.id],
    refetchOnWindowFocus: false,
    queryFn: () => {
      liveInstance.defaults.baseURL = `http://${selectedSite?.ip}:${import.meta.env.VITE_SITES_LIVE_PORT}`;
      return getCamerasInfos().then((extraData) => {
        setSelectedSite((oldSelectedSite) => {
          if (oldSelectedSite == null) {
            return null;
          }
          return {
            ...oldSelectedSite,
            cameras: oldSelectedSite.cameras.map((camera) =>
              aggregateDataFromCamera(camera, extraData)
            ),
          };
        });
        return extraData;
      });
    },
  });

  return (
    <>
      {(status == STATUS_LOADING ||
        (isQueryCamerasEnabled && statusCameras == STATUS_LOADING)) && (
        <Loader />
      )}
      {status == STATUS_ERROR && (
        <Typography variant="body2">{t('errorFetchInfos')}</Typography>
      )}
      {statusCameras == STATUS_ERROR && (
        <Typography variant="body2">{t('errorCallSite')}</Typography>
      )}
      {status == STATUS_SUCCESS && sites.length == 0 && (
        <Typography variant="body2">{t('errorNoAccess')}</Typography>
      )}
      {status == STATUS_SUCCESS &&
        statusCameras == STATUS_SUCCESS &&
        sites.length != 0 &&
        selectedSite && (
          <>
            <WarningCounter onClose={onClose} />
            <Grid container p={2}>
              <Grid size={8}>
                <LiveStreamPanel />
              </Grid>
              <Grid size={4}>
                <LiveControlPanel
                  sites={sites}
                  selectedSite={selectedSite}
                  setSelectedSite={setSelectedSite}
                  selectedCameraId={selectedCameraId}
                  setSelectedCameraId={setSelectedCameraId}
                />
              </Grid>
            </Grid>
          </>
        )}
    </>
  );
};
