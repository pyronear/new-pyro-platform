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
    ? `${import.meta.env.VITE_LIVE_STREAMING_URL}/${site.id}/whep`
    : '';
};

export const calculateSiteUrl = (site: SiteType | null) => {
  return site
    ? `http://${site.ip}:${import.meta.env.VITE_SITES_LIVE_PORT}`
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
    return getMoveToAzimuth(
      sequence.coneAzimuth,
      camera?.azimuths ?? [],
      camera?.poses ?? []
    );
  }
  return null;
};

export const getMoveToAzimuth = (
  azimuthToGoTo: number,
  azimuthsCamera: number[],
  posesCamera: number[]
): MovementCommand | null => {
  const azimuthToGoToRounded = Math.trunc(azimuthToGoTo);
  if (azimuthsCamera.length === 0) {
    return null;
  }
  const distanceAzimuths = azimuthsCamera.map((azimuth) =>
    closestTo0Modulo360(azimuthToGoToRounded - azimuth)
  );
  const indexClosestPose = indexOfClosestTo0(distanceAzimuths);
  if (indexClosestPose < posesCamera.length) {
    const diffDegrees = distanceAzimuths[indexClosestPose];
    return {
      poseId: posesCamera[indexClosestPose],
      degrees: Math.abs(diffDegrees),
      speed: 5,
      direction:
        diffDegrees !== 0
          ? ((diffDegrees > 0 ? 'Right' : 'Left') as CameraDirectionType)
          : undefined,
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
