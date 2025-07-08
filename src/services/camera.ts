import type { AxiosResponse } from 'axios';
import * as z from 'zod/v4';

import { instance } from './axios';

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
  created_at: z.nullable(z.iso.datetime({ local: true })),
});
export type CameraType = z.infer<typeof apiCameraResponseSchema>;
const apiCameraListResponseSchema = z.array(apiCameraResponseSchema);

export const getCameraList = async (): Promise<CameraType[] | null> => {
  return instance
    .get('/api/v1/cameras')
    .then((response: AxiosResponse) => {
      try {
        const result = apiCameraListResponseSchema.safeParse(response.data);
        return result.data ?? null;
      } catch {
        throw new Error('INVALID_API_RESPONSE');
      }
    })
    .catch((err: unknown) => {
      console.error(err);
      return null;
    });
};
