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

import { useActionsOnCamera } from './context/useActionsOnCamera';
import { useDataSitesLive } from './hooks/useDataSitesLive';
import { HeadRow } from './LiveContent/HeadRow/HeadRow';
import { LiveControlPanel } from './LiveContent/LiveControlPanel';
import LiveErrorSnackbar from './LiveContent/LiveErrorSnackbar';
import { LiveStreamPanel } from './LiveContent/LiveStreamPanel';

interface LiveContainerProps {
  onClose: () => void;
  cameraName: string;
  sequence?: SequenceWithCameraInfoType;
}

export const LiveContainer = ({
  onClose,
  cameraName,
  sequence,
}: LiveContainerProps) => {
  const { t } = useTranslationPrefix('live');
  const { statusSitesFetch, sites } = useDataSitesLive();
  const { isStreamingTimeout } = useActionsOnCamera();
  const [isStreamVideoInterrupted, setIsStreamVideoInterrupted] =
    useState<boolean>(false);
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
      const newSelectedSite = getSiteByCameraName(sites, cameraName);
      const newSelectedCameraId = getCameraIdByCameraName(
        newSelectedSite,
        cameraName
      );
      setSelectedSite(newSelectedSite);
      setSelectedCameraId(newSelectedCameraId);
    }
  }, [selectedSite, sites, cameraName]);

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

  const isStreamingLaunched =
    statusSitesFetch == STATUS_SUCCESS &&
    statusCamerasFetchFromSite == STATUS_SUCCESS &&
    !!selectedSite;

  return (
    <>
      <LiveErrorSnackbar />
      <Stack>
        <HeadRow
          onClose={onClose}
          isStreamingLaunched={isStreamingLaunched}
          isStreamingInterrupted={
            isStreamingTimeout && isStreamVideoInterrupted
          }
        />
        {isStreamingLaunched ? (
          <Grid container p={2} spacing={2} flexGrow={1}>
            <Grid size={9}>
              <LiveStreamPanel
                urlStreaming={urlStreaming}
                setIsStreamVideoInterrupted={setIsStreamVideoInterrupted}
                camera={selectedCamera}
                sequence={sequence}
              />
            </Grid>
            <Grid size={3}>
              <LiveControlPanel
                sites={sites}
                selectedSite={selectedSite}
                setSelectedSite={setSelectedSite}
                selectedCamera={selectedCamera}
                setSelectedCameraId={setSelectedCameraId}
                sequence={sequence}
              />
            </Grid>
          </Grid>
        ) : (
          <Stack m={6}>
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
          </Stack>
        )}
      </Stack>
    </>
  );
};
