import { type CameraDirectionType } from '@/services/live';

import type { SiteType } from './camera';

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

export interface ControlledMove {
  poseId: number;
  degrees: number;
  direction: CameraDirectionType;
}

export const getMoveToAzimuth = (
  azimuthToGoTo: number,
  azimuthsCamera: number[],
  posesCamera: number[]
): ControlledMove | undefined => {
  if (azimuthsCamera.length === 0) {
    return undefined;
  }
  const distanceAzimuths = azimuthsCamera.map((azimuth) =>
    closestTo0Modulo360(azimuthToGoTo - azimuth)
  );
  const indexClosestPose = indexOfClosestTo0(distanceAzimuths);
  if (indexClosestPose < posesCamera.length) {
    return {
      poseId: posesCamera[indexClosestPose],
      degrees: Math.abs(distanceAzimuths[indexClosestPose]),
      direction: (distanceAzimuths[indexClosestPose] > 0
        ? 'Right'
        : 'Left') as CameraDirectionType,
    };
  }
  return undefined;
};

const closestTo0Modulo360 = (diff: number) => {
  const modulos = [diff, diff + 360, diff - 360];
  return modulos[indexOfClosestTo0(modulos)];
};

const indexOfClosestTo0 = (array: number[]) => {
  const absoluteArray = array.map((nb) => Math.abs(nb));
  return absoluteArray.indexOf(Math.min(...absoluteArray));
};
