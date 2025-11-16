import type { CameraType } from '@/services/camera';
import type { CameraInfosFromPi } from '@/services/live';

import type { SequenceWithCameraInfoType } from './alerts';
import { buildVisionPolygon, DEFAULT_CAM_RANGE_KM } from './cameraVision';

export interface CameraFullInfosType extends CameraType {
  ip?: string;
  type?: string;
  azimuths?: number[];
  poses?: number[];
}

export interface SiteType {
  id: string;
  ip: string;
  label: string;
  cameras: CameraFullInfosType[];
}

export const getSiteByCameraName = (
  sites: SiteType[],
  cameraName: string
): SiteType | null => {
  return (
    sites.find((site) =>
      site.cameras.map((camera) => camera.name).includes(cameraName)
    ) ?? null
  );
};

export const getCameraIdByCameraName = (
  site: SiteType | null,
  cameraName: string
): number | null => {
  if (site === null) {
    return null;
  }
  return (
    site.cameras.find((c) => c.name == cameraName)?.id ??
    getDefaultCameraIdBySite(site)
  );
};

export const getDefaultCameraIdBySite = (site: SiteType) => {
  return site.cameras.length > 0 ? site.cameras[0].id : null;
};

const aggregateCameraData = (
  camera: CameraType,
  extraData: CameraInfosFromPi[]
): CameraFullInfosType => {
  const cameraInfosFromPi = extraData.find(
    (cameraFromPi) => cameraFromPi.name == camera.name
  );
  return {
    ...camera,
    ip: cameraInfosFromPi?.ip,
    type: cameraInfosFromPi?.type,
    azimuths: cameraInfosFromPi?.azimuths ?? [],
    poses: cameraInfosFromPi?.poses ?? [],
  };
};

export const aggregateSiteData = (
  site: SiteType,
  extraData: CameraInfosFromPi[]
) => {
  return {
    ...site,
    cameras: site.cameras.map((camera) =>
      aggregateCameraData(camera, extraData)
    ),
  };
};

const DEFAULT_ANGLE_OF_VIEW = 1;

export const buildPolygonsFromCamera = (
  camera: CameraType | CameraFullInfosType
): { azimuth: number; visionPolygon: L.LatLng[] }[] => {
  const angleOfView = camera.angle_of_view ?? DEFAULT_ANGLE_OF_VIEW;
  const azimuths = (camera as CameraFullInfosType).azimuths ?? [];
  return azimuths.map((azimuth) => ({
    azimuth,
    visionPolygon: buildVisionPolygon(
      camera.lat,
      camera.lon,
      azimuth,
      angleOfView,
      DEFAULT_CAM_RANGE_KM
    ),
  }));
};

export const buildPolygonFromSequence = (
  sequence: SequenceWithCameraInfoType
): L.LatLng[] => {
  if (sequence.camera) {
    return buildVisionPolygon(
      sequence.camera.lat,
      sequence.camera.lon,
      sequence.coneAzimuth,
      sequence.coneAngle,
      DEFAULT_CAM_RANGE_KM
    );
  }
  return [];
};
