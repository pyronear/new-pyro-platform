import type { AxiosResponse } from 'axios';
import * as z from 'zod/v4';

import { convertStrToEpoch } from '../utils/dates';
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

const apiDetectionResponseSchema = z.object({
  id: z.number(),
  camera_id: z.number(),
  azimuth: z.nullable(z.number()),
  bucket_key: z.string(),
  bboxes: z.string(),
  created_at: z.iso.datetime({ local: true }),
  url: z.string(),
});

export type SequenceType = z.infer<typeof apiSequenceResponseSchema>;
const apiSequenceListResponseSchema = z.array(apiSequenceResponseSchema);

export type DetectionType = z.infer<typeof apiDetectionResponseSchema>;
const apiDetectionListResponseSchema = z.array(apiDetectionResponseSchema);

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

export const getSequencesByFilters = async (
  fromDate: string,
  limit: number,
  offset: number
): Promise<SequenceType[]> => {
  const params = {
    from_date: fromDate,
    limit,
    offset,
  };
  return instance
    .get('/api/v1/sequences/all/fromdate', { params })
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

export const getDetectionsBySequence = async (
  sequenceId: number
): Promise<DetectionType[]> => {
  return instance
    .get(`/api/v1/sequences/${sequenceId.toString()}/detections`)
    .then((response: AxiosResponse) => {
      try {
        const result = apiDetectionListResponseSchema.safeParse(response.data);
        if (result.data) {
          result.data.sort(
            (d1, d2) =>
              convertStrToEpoch(d1.created_at) -
              convertStrToEpoch(d2.created_at)
          );
        }
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

export const labelBySequenceId = async (
  sequenceId: number,
  isWildfire: boolean | null
) => {
  return instance
    .patch(`/api/v1/sequences/${sequenceId.toString()}/label`, {
      is_wildfire: isWildfire,
    })
    .then((response: AxiosResponse) => {
      try {
        const result = apiSequenceResponseSchema.safeParse(response.data);
        return result.success;
      } catch {
        throw new Error('INVALID_API_RESPONSE');
      }
    })
    .catch((err: unknown) => {
      console.error(err);
      throw err;
    });
};
