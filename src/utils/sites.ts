import type { CameraType } from '@/services/camera.ts';
import { type AlertType, extractCameraListFromAlert } from '@/utils/alerts.ts';
import type { SiteType } from '@/utils/camera.ts';

export const buildSitesList = (cameraList: CameraType[]) => {
  const sitesList = cameraList
    .map((camera) => camera.name)
    .map((cameraName) => cameraName.replace(/(-\d{1,2})$/, ''))
    .filter((cameraName, index, list) => list.indexOf(cameraName) === index);

  return sitesList.map((r) => {
    const cameras = cameraList.filter((camera) => camera.name.startsWith(r));
    return { id: r, cameras };
  });
};

export const containsAtLeastOneCameraWithAlert = (
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
