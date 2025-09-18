import { Grid, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import {
  liveInstance,
  STATUS_ERROR,
  STATUS_LOADING,
  STATUS_SUCCESS,
} from '@/services/axios';
import { getCamerasInfos } from '@/services/live';
import {
  aggregateSiteData,
  getCameraIdByCameraName,
  getSiteByCameraName,
} from '@/utils/camera';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { Loader } from '../Common/Loader';
import { LiveControlPanel } from './LiveControlPanel';
import { LiveStreamPanel } from './LiveStreamPanel';
import { LiveWarningCounter } from './LiveWarningCounter';
import { type SiteType, useDataSitesLive } from './useDataSitesLive';
import type { StreamingAction } from './useStreamingVideo';

interface LiveContainerProps {
  onClose: () => void;
  targetCameraName: string;
  addNewStreamingAction: (newStreamingAction: StreamingAction) => void;
  statusStreamingAction: string;
}

export const LiveContainer = ({
  onClose,
  targetCameraName,
  addNewStreamingAction,
  statusStreamingAction,
}: LiveContainerProps) => {
  const { t } = useTranslationPrefix('live');
  const { statusSitesFetch, sites } = useDataSitesLive();
  const [selectedSite, setSelectedSite] = useState<SiteType | null>(null);
  const [selectedCameraId, setSelectedCameraId] = useState<number | null>(null);
  const isFetchFromSiteEnabled = !!selectedSite;
  const selectedCamera = useMemo(() => {
    return selectedSite?.cameras.find((c) => c.id === selectedCameraId) ?? null;
  }, [selectedCameraId, selectedSite]);

  const urlStreaming = useMemo(
    () =>
      selectedSite
        ? `${import.meta.env.VITE_LIVE_STREAMING_URL}/${selectedSite.id}/?controls=false`
        : '',
    [selectedSite]
  );

  useEffect(() => {
    if (selectedSite == null) {
      // Select by default target camera and its site
      const newSelectedSite = getSiteByCameraName(sites, targetCameraName);
      const newSelectedCameraId = getCameraIdByCameraName(
        newSelectedSite,
        targetCameraName
      );
      setSelectedSite(newSelectedSite);
      setSelectedCameraId(newSelectedCameraId);
    }
  }, [selectedSite, sites, targetCameraName]);

  // TODO : retrieve the data from backend api
  const { status: statusCamerasFetchFromSite } = useQuery({
    enabled: isFetchFromSiteEnabled,
    queryKey: ['camerasLive', selectedSite?.id],
    refetchOnWindowFocus: false,
    queryFn: () => {
      liveInstance.defaults.baseURL = `http://${selectedSite?.ip}:${import.meta.env.VITE_SITES_LIVE_PORT}`;
      return getCamerasInfos().then((extraData) => {
        setSelectedSite((oldSelectedSite) =>
          oldSelectedSite == null
            ? null
            : aggregateSiteData(oldSelectedSite, extraData)
        );
        return extraData;
      });
    },
  });

  return (
    <Stack>
      {(statusSitesFetch == STATUS_LOADING ||
        (isFetchFromSiteEnabled &&
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
      {statusSitesFetch == STATUS_SUCCESS &&
        statusCamerasFetchFromSite == STATUS_SUCCESS &&
        selectedSite && (
          <>
            <LiveWarningCounter onClose={onClose} />
            <Grid container p={2} spacing={2} flexGrow={1}>
              <Grid size={9}>
                <LiveStreamPanel
                  urlStreaming={urlStreaming}
                  camera={selectedCamera}
                  addNewStreamingAction={addNewStreamingAction}
                  statusStreamingAction={statusStreamingAction}
                />
              </Grid>
              <Grid size={3}>
                <LiveControlPanel
                  sites={sites}
                  selectedSite={selectedSite}
                  setSelectedSite={setSelectedSite}
                  selectedCamera={selectedCamera}
                  setSelectedCameraId={setSelectedCameraId}
                />
              </Grid>
            </Grid>
          </>
        )}
    </Stack>
  );
};
