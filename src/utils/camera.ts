import type { CameraType, PoseCameraType } from '@/services/camera';
import type { CameraInfosFromPi } from '@/services/live';

import type { SequenceWithCameraInfoType } from './alerts';
import { buildVisionPolygon, DEFAULT_CAM_RANGE_KM } from './cameraVision';

export interface CameraFullInfosType extends CameraType {
  ip?: string;
  type?: string;
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
    poses: camera.poses ?? buildPosesFromPiData(camera.id, cameraInfosFromPi),
    ip: cameraInfosFromPi?.ip,
    type: cameraInfosFromPi?.type,
  };
};

const buildPosesFromPiData = (
  idCamera: number,
  cameraInfosFromPi?: CameraInfosFromPi
): PoseCameraType[] => {
  return (
    cameraInfosFromPi?.poses.map((value, index) => ({
      id: value,
      azimuth: cameraInfosFromPi.azimuths[index],
      camera_id: idCamera,
      patrol_id: value,
    })) ?? []
  );
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

interface CameraWithPolygons extends Omit<CameraType, 'poses'> {
  poses: (PoseCameraType & {
    visionPolygon: L.LatLng[];
  })[];
}

export const buildPolygonsFromCamera = (
  camera: CameraType | CameraFullInfosType
): CameraWithPolygons => {
  const angleOfView = camera.angle_of_view ?? DEFAULT_ANGLE_OF_VIEW;
  const poses = (camera as CameraType).poses ?? [];
  return {
    ...camera,
    poses: poses.map((pose) => {
      return {
        ...pose,
        visionPolygon: buildVisionPolygon(
          camera.lat,
          camera.lon,
          pose.azimuth,
          angleOfView,
          DEFAULT_CAM_RANGE_KM
        ),
      };
    }),
  };
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
