import appConfig from '@/services/appConfig';
import type { PoseCameraType } from '@/services/camera';
import { type CameraDirectionType } from '@/services/live';

import { type AlertType, getSequenceByCameraId } from './alerts';
import type { CameraFullInfosType, SiteType } from './camera';

const TYPE_PTZ = 'ptz';

export const calculateHasZoom = (cameraType: string | undefined) => {
  return cameraType === TYPE_PTZ;
};

export const calculateHasRotation = (cameraType: string | undefined) => {
  return cameraType === TYPE_PTZ;
};

interface SpeedCameraMove {
  speed: number;
  name: number;
}

export const SPEEDS: SpeedCameraMove[] = [
  { name: 0.5, speed: 1 },
  { name: 1, speed: 5 },
  { name: 2, speed: 10 },
];

export const calculateLiveStreamingUrl = (site: SiteType | null) => {
  return site
    ? `${appConfig.getConfig().LIVE_STREAMING_MEDIA_URL}/${site.id}/whep`
    : '';
};

export const calculateSiteUrl = (site: SiteType | null) => {
  return site
    ? `http://${site.ip}:${appConfig.getConfig().LIVE_STREAMING_SITE_PORT}`
    : '';
};

export const isAzimuthValid = (azimuthStr: string) => {
  if (!azimuthStr) {
    return true;
  }
  const azimuthNb = Number(azimuthStr);
  if (Number.isInteger(azimuthNb)) {
    return azimuthNb > 0 && azimuthNb < 360;
  }
  return false;
};

export const getClosestPose = (
  azimuth: number,
  azimuthsCamera: number[],
  posesCamera: number[]
) => {
  if (azimuthsCamera.length === 0) {
    return null;
  }
  const distanceAzimuths = azimuthsCamera.map((a) => Math.abs(a - azimuth));
  const indexClosestPose = distanceAzimuths.indexOf(
    Math.min(...distanceAzimuths)
  );
  return indexClosestPose < posesCamera.length
    ? posesCamera[indexClosestPose]
    : null;
};

export interface MovementCommand {
  poseId?: number;
  degrees?: number;
  speed?: number;
  direction?: CameraDirectionType;
}

export const getMoveToAzimuthFromAlert = (
  camera: CameraFullInfosType | null,
  alert?: AlertType
) => {
  const sequence =
    alert && camera ? getSequenceByCameraId(alert, camera.id) : null;
  if (sequence) {
    return getMoveToAzimuth(sequence.coneAzimuth, camera?.poses ?? []);
  }
  return null;
};

export const getMoveToAzimuth = (
  azimuthToGoTo: number,
  poses: PoseCameraType[]
): MovementCommand | null => {
  const azimuthToGoToRounded = Math.trunc(azimuthToGoTo);
  if (poses.length === 0) {
    return null;
  }
  const distanceAzimuths = poses.map((pose) =>
    closestTo0Modulo360(azimuthToGoToRounded - pose.azimuth)
  );
  const indexClosestPose = indexOfClosestTo0(distanceAzimuths);
  if (poses[indexClosestPose].patrol_id != null) {
    const diffDegrees = distanceAzimuths[indexClosestPose];
    const direction = (
      diffDegrees > 0 ? 'Right' : 'Left'
    ) as CameraDirectionType;
    return {
      poseId: poses[indexClosestPose].patrol_id,
      degrees: Math.abs(diffDegrees),
      speed: 5,
      direction: diffDegrees === 0 ? undefined : direction,
    };
  }
  return null;
};

const closestTo0Modulo360 = (diff: number) => {
  const modulos = [diff, diff + 360, diff - 360];
  return modulos[indexOfClosestTo0(modulos)];
};

const indexOfClosestTo0 = (array: number[]) => {
  const absoluteArray = array.map((nb) => Math.abs(nb));
  return absoluteArray.indexOf(Math.min(...absoluteArray));
};
