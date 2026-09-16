import Typography from '@mui/material/Typography';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Loader } from '@/components/Common/Loader.tsx';
import { ActionsOnCameraContextProvider } from '@/components/Live/context/ActionsOnCameraProvider.tsx';
import { useLiveAllowed } from '@/components/Live/hooks/useLiveAllowed.tsx';
import { LiveContainer } from '@/components/Live/LiveContainer.tsx';
import { ForbiddenPage } from '@/pages/ForbiddenPage.tsx';
import { getAlertById } from '@/services/alerts.ts';
import { getCameraList } from '@/services/camera.ts';
import { type AlertType, mapOneAlertApiToAlertType } from '@/utils/alerts.ts';
import type { SiteType } from '@/utils/camera.ts';
import {
  buildSitesList,
  containsAtLeastOneCameraWithAlert,
} from '@/utils/sites.ts';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix.ts';

const LivestreamingPage = () => {
  const navigate = useNavigate();
  const { isLiveAuthorized } = useLiveAllowed();
  const { t } = useTranslationPrefix('live');

  const { cameraName, alertId } = useParams<{
    cameraName: string;
    alertId?: string;
  }>();
  const alertIdNumber = Number(alertId);
  const withAlert = !Number.isNaN(alertIdNumber);

  const goBack = () => {
    void navigate(-1);
  };

  const { status: statusCameras, data: cameraList } = useQuery({
    queryKey: ['cameras'],
    queryFn: getCameraList,
  });

  const { status: statusAlert, data: alertData } = useQuery({
    queryKey: ['alert', alertIdNumber],
    queryFn: () => getAlertById(alertIdNumber),
    enabled: withAlert,
  });

  const isCameraAuthorized = () => {
    return (
      isLiveAuthorized &&
      !!cameraName &&
      (cameraList ?? []).map((camera) => camera.name).includes(cameraName)
    );
  };

  const alert: AlertType | undefined = useMemo(
    () =>
      alertData
        ? mapOneAlertApiToAlertType(alertData, cameraList ?? [])
        : undefined,
    [alertData, cameraList]
  );

  const sites: SiteType[] = useMemo(() => {
    let sites = buildSitesList(cameraList ?? []);
    if (alert) {
      sites = sites.filter((site) =>
        containsAtLeastOneCameraWithAlert(site, alert)
      );
    }
    return sites;
  }, [cameraList, alert]);

  const isAlertFetching = withAlert && statusAlert == 'pending';

  return (
    <>
      {(statusCameras == 'pending' || isAlertFetching) && <Loader />}
      {statusCameras == 'error' && (
        <Typography variant="body2">{t('errorFetchInfos')}</Typography>
      )}
      {statusCameras == 'success' && !isAlertFetching && (
        <>
          {isCameraAuthorized() ? (
            <ActionsOnCameraContextProvider>
              {cameraName && (
                <LiveContainer
                  onClose={goBack}
                  cameraName={cameraName}
                  sites={sites}
                  alert={alert}
                />
              )}
            </ActionsOnCameraContextProvider>
          ) : (
            <ForbiddenPage />
          )}
        </>
      )}
    </>
  );
};
export default LivestreamingPage;
