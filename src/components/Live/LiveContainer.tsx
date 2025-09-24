import { Grid, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import { Loader } from '@/components/Common/Loader';
import {
  liveInstance,
  STATUS_ERROR,
  STATUS_LOADING,
  STATUS_SUCCESS,
} from '@/services/axios';
import { getCamerasInfos } from '@/services/live';
import type { SequenceWithCameraInfoType } from '@/utils/alerts';
import {
  aggregateSiteData,
  getCameraIdByCameraName,
  getSiteByCameraName,
  type SiteType,
} from '@/utils/camera';
import { calculateLiveStreamingUrl, calculateSiteUrl } from '@/utils/live';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { useDataSitesLive } from './hooks/useDataSitesLive';
import { LiveControlPanel } from './LiveContent/LiveControlPanel';
import { LiveSequenceInfo } from './LiveContent/LiveSequenceInfo';
import { LiveStreamPanel } from './LiveContent/LiveStreamPanel';
import { LiveWarningCounter } from './LiveContent/LiveWarningCounter';

interface LiveContainerProps {
  onClose: () => void;
  targetCameraName: string;
  targetSequence?: SequenceWithCameraInfoType;
  startStreamingVideo: (ip: string, hasRotation: boolean) => void;
  stopStreamingVideo: (ip: string, hasRotation: boolean) => void;
  statusStreamingVideo: string;
}

export const LiveContainer = ({
  onClose,
  targetCameraName,
  targetSequence,
  startStreamingVideo,
  stopStreamingVideo,
  statusStreamingVideo,
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
    () => calculateLiveStreamingUrl(selectedSite),
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
      liveInstance.defaults.baseURL = calculateSiteUrl(selectedSite);
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
                  startStreamingVideo={startStreamingVideo}
                  stopStreamingVideo={stopStreamingVideo}
                  statusStreamingVideo={statusStreamingVideo}
                />
              </Grid>
              <Grid size={3}>
                {targetSequence && (
                  <LiveSequenceInfo sequence={targetSequence} />
                )}
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
