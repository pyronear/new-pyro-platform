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
