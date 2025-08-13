import type { AxiosResponse } from 'axios';
import * as z from 'zod/v4';

import { liveInstance } from './axios';

const apiCameraInfosResponseSchema = z.object({
  id: z.number(),
});

export type CameraInfo = z.infer<typeof apiCameraInfosResponseSchema>;

export const getInfosCamera = async (): Promise<CameraInfo | null> => {
  return liveInstance
    .get('/info/camera_infos')
    .then((response: AxiosResponse) => {
      try {
        const result = apiCameraInfosResponseSchema.safeParse(response.data);
        return result.data ?? null;
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
      console.log(result);
      if (result.success) {
        console.log(username);
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
