import type { AxiosResponse } from 'axios';
import * as z from 'zod/v4';

import { liveInstance } from './axios';

const apiCameraInfosResponseSchema = z.object({
  ip: z.string(),
  name: z.string(),
  azimuths: z.array(z.number()),
  poses: z.array(z.number()),
  id: z.string(),
  type: z.string(),
  brand: z.string(),
});

const apiCamerasInfosResponseSchema = z.object({
  cameras: z.array(apiCameraInfosResponseSchema),
});

export type CameraInfosFromPi = z.infer<typeof apiCameraInfosResponseSchema>;

export const getCamerasInfos = async (): Promise<CameraInfosFromPi[]> => {
  return liveInstance
    .get('/info/camera_infos')
    .then((response: AxiosResponse) => {
      try {
        const result = apiCamerasInfosResponseSchema.safeParse(response.data);
        return result.data?.cameras ?? [];
      } catch {
        throw new Error('INVALID_API_RESPONSE');
      }
    })
    .catch((err: unknown) => {
      console.error(err);
      throw err;
    });
};

const apiSitesLiveAccessResponseSchema = z.record(
  z.string(),
  z.array(z.string())
);

export const getLiveAccess = async (username: string): Promise<string[]> => {
  return fetch('/' + import.meta.env.VITE_FILE_SITES_LIVE_ACCESS)
    .then((r) => r.json())
    .then((response) => {
      const result = apiSitesLiveAccessResponseSchema.safeParse(response);
      if (result.success) {
        return result.data[username] ?? [];
      }
      return [];
    });
};

const apiSiteResponseSchema = z.object({
  ip: z.string(),
  name: z.string(),
});
export type SiteInfos = z.infer<typeof apiSiteResponseSchema>;
const apiSitesInfosResponseSchema = z.record(z.string(), apiSiteResponseSchema);

export const getSitesInfos = async (): Promise<Record<string, SiteInfos>> => {
  return fetch('/' + import.meta.env.VITE_FILE_SITES_INFOS)
    .then((r) => r.json())
    .then((response) => {
      const result = apiSitesInfosResponseSchema.safeParse(response);
      if (result.success) {
        return result.data;
      }
      return {};
    });
};
