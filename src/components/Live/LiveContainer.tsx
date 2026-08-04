import { Grid, Stack, Typography } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { Loader } from '@/components/Common/Loader';
import appConfig from '@/services/appConfig.ts';
import { STATUS_ERROR, STATUS_LOADING, STATUS_SUCCESS } from '@/services/axios';
import { getCameraAzimuth, getCamerasInfos } from '@/services/live';
import { type AlertType } from '@/utils/alerts';
import {
  aggregateSiteData,
  getCameraIdByCameraName,
  getDefaultCameraIdBySite,
  getSiteByCameraName,
  type SiteType,
} from '@/utils/camera';
import { calculateLiveStreamingUrl } from '@/utils/live';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { useActionsOnCamera } from './context/useActionsOnCamera';
import { useDataSitesLive } from './hooks/useDataSitesLive';
import { HeadRow } from './LiveContent/HeadRow/HeadRow';
import { LiveControlPanel } from './LiveContent/LiveControlPanel';
import { LiveStreamPanel } from './LiveContent/LiveStreamPanel';

const MOVING_AZIMUTH_REFETCH_INTERVAL_MS =
  appConfig.getConfig().MOVING_AZIMUTH_REFETCH_INTERVAL_SECONDS * 1000;
const STABLE_AZIMUTH_REFETCH_INTERVAL_MS =
  appConfig.getConfig().STABLE_AZIMUTH_REFETCH_INTERVAL_SECONDS * 1000;

interface LiveContainerProps {
  onClose: () => void;
  cameraName: string;
  alert?: AlertType;
}

export const LiveContainer = ({
  onClose,
  cameraName,
  alert,
}: LiveContainerProps) => {
  const queryClient = useQueryClient();
  const { t } = useTranslationPrefix('live');
  const { statusSitesFetch, sites } = useDataSitesLive(alert);
  const { isStreamingTimeout, isOneActionLoading } = useActionsOnCamera();
  const [isStreamVideoInterrupted, setIsStreamVideoInterrupted] =
    useState<boolean>(false);
  const [selectedSite, setSelectedSite] = useState<SiteType | null>(null);
  const [selectedCameraId, setSelectedCameraId] = useState<number | null>(null);
  const [isCameraMoving, setIsMoving] = useState<boolean>(false);

  const selectedCamera = useMemo(() => {
    return selectedSite?.cameras.find((c) => c.id === selectedCameraId) ?? null;
  }, [selectedCameraId, selectedSite]);

  const isCameraSelected = !!selectedSite && !!selectedCamera;

  const changeCamera = (newSite: SiteType, newCameraId: number | null) => {
    setSelectedSite(newSite);
    setSelectedCameraId(newCameraId ?? getDefaultCameraIdBySite(newSite));
  };

  const urlStreaming = useMemo(
    () => calculateLiveStreamingUrl(selectedSite),
    [selectedSite]
  );

  useEffect(() => {
    if (selectedSite == null) {
      // Select by default target camera and its site
      const newSelectedSite = getSiteByCameraName(sites, cameraName);
      const newSelectedCameraId = getCameraIdByCameraName(
        newSelectedSite,
        cameraName
      );
      if (newSelectedSite) {
        changeCamera(newSelectedSite, newSelectedCameraId);
      } else {
        console.error(`Camera ${cameraName} not found in user allowed sites`);
      }
    }
  }, [selectedSite, sites, cameraName]);

  // TODO : retrieve the data from backend api
  const { status: statusCamerasFetchFromSite } = useQuery({
    enabled: isCameraSelected,
    queryKey: ['camerasLive', selectedSite?.id],
    refetchOnWindowFocus: false,
    queryFn: () => {
      if (selectedCamera) {
        return getCamerasInfos(selectedCamera.id).then((extraData) => {
          setSelectedSite((oldSelectedSite) =>
            oldSelectedSite == null
              ? null
              : aggregateSiteData(oldSelectedSite, extraData)
          );
          return extraData;
        });
      }
      return;
    },
  });

  // Live camera orientation, polled from the device through the API. The
  // azimuth is null until the camera has a reference (first preset move).
  const { data: liveAzimuth } = useQuery({
    queryKey: ['cameraAzimuth', selectedCamera?.id],
    queryFn: () => selectedCamera && getCameraAzimuth(selectedCamera.id),
    refetchInterval: isCameraMoving
      ? MOVING_AZIMUTH_REFETCH_INTERVAL_MS
      : STABLE_AZIMUTH_REFETCH_INTERVAL_MS,
    initialData: null,
    retry: false,
    enabled: !!selectedCamera,
  });

  const invalidateAndRefreshAzimuthCamera = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: ['cameraAzimuth', selectedCamera?.id],
    });
  }, [queryClient, selectedCamera?.id]);

  // If one action is triggered on camera, invalidate azimuth immediatly
  useEffect(() => {
    if (isOneActionLoading) {
      invalidateAndRefreshAzimuthCamera();
    }
  }, [invalidateAndRefreshAzimuthCamera, isOneActionLoading]);

  useEffect(() => {
    setIsMoving(liveAzimuth?.moving ?? false);
  }, [liveAzimuth]);

  const isStreamingLaunched =
    statusSitesFetch == STATUS_SUCCESS &&
    statusCamerasFetchFromSite == STATUS_SUCCESS &&
    isCameraSelected;

  const isAzimuthLoading =
    isOneActionLoading ||
    (liveAzimuth?.moving ?? false) ||
    !liveAzimuth?.azimuth_deg;

  return (
    <>
      <Stack height="100%">
        <HeadRow
          onClose={onClose}
          isStreamingLaunched={isStreamingLaunched}
          isStreamingInterrupted={
            isStreamingTimeout && isStreamVideoInterrupted
          }
        />
        {isStreamingLaunched ? (
          <Grid container spacing={2} flexGrow={1}>
            <Grid size={8}>
              <LiveStreamPanel
                urlStreaming={urlStreaming}
                setIsStreamVideoInterrupted={setIsStreamVideoInterrupted}
                camera={selectedCamera}
                liveAzimuth={liveAzimuth}
                isAzimuthLoading={isAzimuthLoading}
                alert={alert}
              />
            </Grid>
            <Grid size={4}>
              <LiveControlPanel
                sites={sites}
                selectedSite={selectedSite}
                selectedCamera={selectedCamera}
                liveAzimuth={liveAzimuth}
                changeCamera={changeCamera}
                alert={alert}
              />
            </Grid>
          </Grid>
        ) : (
          <Stack m={6}>
            {(statusSitesFetch == STATUS_LOADING ||
              (isCameraSelected &&
                statusCamerasFetchFromSite == STATUS_LOADING)) && <Loader />}
            {statusSitesFetch == STATUS_ERROR && (
              <Typography variant="body2">{t('errorFetchInfos')}</Typography>
            )}
            {statusCamerasFetchFromSite == STATUS_ERROR && (
              <Typography variant="body2">{t('errorCallSite')}</Typography>
            )}
            {statusSitesFetch == STATUS_SUCCESS && sites.length == 0 && (
              <Typography variant="body2">{t('errorNoAccess')}</Typography>
            )}
          </Stack>
        )}
      </Stack>
    </>
  );
};
