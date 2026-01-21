import type { AxiosResponse } from 'axios';
import * as z from 'zod/v4';

import { apiInstance } from './axios';

const apiPoseCameraResponseSchema = z.object({
  id: z.number(),
  camera_id: z.number(),
  azimuth: z.number(),
  patrol_id: z.nullable(z.number()),
});

const apiCameraResponseSchema = z.object({
  id: z.number(),
  organization_id: z.number(),
  name: z.string(),
  angle_of_view: z.nullable(z.number()),
  elevation: z.nullable(z.number()),
  lat: z.number(),
  lon: z.number(),
  is_trustable: z.boolean(),
  last_active_at: z.nullable(z.iso.datetime({ local: true })),
  last_image: z.nullable(z.string()),
  last_image_url: z.nullable(z.string()),
  created_at: z.nullable(z.iso.datetime({ local: true })),
  poses: z.nullable(z.array(apiPoseCameraResponseSchema)).default([]),
});
export type CameraType = z.infer<typeof apiCameraResponseSchema>;
export type PoseCameraType = z.infer<typeof apiPoseCameraResponseSchema>;
const apiCameraListResponseSchema = z.array(apiCameraResponseSchema);

export const getCameraList = async (): Promise<CameraType[]> => {
  return apiInstance
    .get('/api/v1/cameras/')
    .then((response: AxiosResponse) => {
      try {
        const result = apiCameraListResponseSchema.safeParse(response.data);
        return result.data ?? [];
      } catch {
        throw new Error('INVALID_API_RESPONSE');
      }
    })
    .catch((err: unknown) => {
      console.error(err);
      throw err;
    });
};
