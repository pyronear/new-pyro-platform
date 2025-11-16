import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useAuth } from '@/context/useAuth';
import { STATUS_ERROR, STATUS_LOADING, STATUS_SUCCESS } from '@/services/axios';
import { getCameraList } from '@/services/camera';
import { getLiveAccess, getSitesInfos } from '@/services/live';
import { type AlertType, extractCameraListFromAlert } from '@/utils/alerts';
import type { SiteType } from '@/utils/camera';

export const useDataSitesLive = (alert?: AlertType) => {
  const auth = useAuth();
  const { status: statusLiveAccess, data: liveAccess } = useQuery({
    queryKey: ['liveAccess'],
    queryFn: () => (auth.username ? getLiveAccess(auth.username) : []),
  });
  const { status: statusSitesInfos, data: sitesInfos } = useQuery({
    queryKey: ['sitesInfos'],
    queryFn: () => getSitesInfos(),
  });
  const { status: statusCameras, data: cameraList } = useQuery({
    queryKey: ['cameras'],
    queryFn: getCameraList,
  });

  const containsAtLeastOneCameraWithAlert = (
    site: SiteType,
    alert: AlertType
  ) => {
    const alertCameraIdList = extractCameraListFromAlert(alert).map(
      (camera) => camera.id
    );
    const siteCameraIdList = site.cameras.map((camera) => camera.id);
    return siteCameraIdList.some((siteCameraId) =>
      alertCameraIdList.includes(siteCameraId)
    );
  };

  const sites: SiteType[] = useMemo(() => {
    return Object.entries(sitesInfos ?? {})
      .map((r) => {
        const cameras =
          cameraList?.filter((camera) => camera.name.startsWith(r[0])) ?? [];
        return { id: r[0], ip: r[1].ip, label: r[1].name, cameras };
      })
      .filter((s) => liveAccess?.includes(s.id))
      .filter((s) =>
        alert ? containsAtLeastOneCameraWithAlert(s, alert) : true
      );
  }, [sitesInfos, cameraList, liveAccess, alert]);

  const statusSitesFetch = useMemo(() => {
    if (
      statusLiveAccess == STATUS_SUCCESS &&
      statusSitesInfos == STATUS_SUCCESS &&
      statusCameras == STATUS_SUCCESS
    ) {
      return STATUS_SUCCESS;
    }
    if (
      statusLiveAccess == STATUS_LOADING ||
      statusSitesInfos == STATUS_LOADING ||
      statusCameras == STATUS_LOADING
    ) {
      return STATUS_LOADING;
    }
    return STATUS_ERROR;
  }, [statusLiveAccess, statusSitesInfos, statusCameras]);

  return { sites, statusSitesFetch };
};
