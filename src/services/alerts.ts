import type { AxiosResponse } from 'axios';
import * as z from 'zod/v4';

import { instance } from './axios';

const apiSequenceResponseSchema = z.object({
  id: z.number(),
  camera_id: z.number(),
  azimuth: z.nullable(z.number()),
  cone_azimuth: z.number(),
  cone_angle: z.number(),
  is_wildfire: z.nullable(z.boolean()),
  started_at: z.nullable(z.iso.datetime({ local: true })),
  last_seen_at: z.nullable(z.string()),
});

export type SequenceType = z.infer<typeof apiSequenceResponseSchema>;
const apiSequenceListResponseSchema = z.array(apiSequenceResponseSchema);

export const getUnlabelledLatestSequences = async (): Promise<
  SequenceType[]
> => {
  return instance
    .get('/api/v1/sequences/unlabeled/latest')
    .then((response: AxiosResponse) => {
      try {
        const result = apiSequenceListResponseSchema.safeParse(response.data);
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
