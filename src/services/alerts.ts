import type { AxiosResponse } from 'axios';
import * as z from 'zod/v4';

import { apiInstance } from './axios';

const apiSequenceResponseSchema = z.object({
  id: z.number(),
  camera_id: z.number(),
  pose_id: z.number(),
  sequence_azimuth: z.number(),
  cone_angle: z.number(),
  is_wildfire: z.nullable(z.string()),
  started_at: z.nullable(z.iso.datetime({ local: true })),
  last_seen_at: z.nullable(z.string()),
  detections_count: z.number().int().nonnegative(),
});

const apiAlertResponseSchema = z.object({
  id: z.number(),
  organization_id: z.number(),
  lat: z.nullable(z.number()),
  lon: z.nullable(z.number()),
  started_at: z.iso.datetime({ local: true }),
  last_seen_at: z.iso.datetime({ local: true }),
  sequences: z.array(apiSequenceResponseSchema),
});

const apiDetectionResponseSchema = z.object({
  id: z.number(),
  camera_id: z.number(),
  pose_id: z.number(),
  sequence_id: z.number(),
  bucket_key: z.string(),
  bbox: z.string(),
  others_bboxes: z.nullable(z.string()),
  created_at: z.iso.datetime({ local: true }),
  url: z.string(),
  crop_url: z.string().nullish(),
});

export type SequenceTypeApi = z.infer<typeof apiSequenceResponseSchema>;
export type AlertTypeApi = z.infer<typeof apiAlertResponseSchema>;
const apiAlertListResponseSchema = z.array(apiAlertResponseSchema);

export type DetectionType = z.infer<typeof apiDetectionResponseSchema>;
const apiDetectionListResponseSchema = z.array(apiDetectionResponseSchema);

export const getAlertById = async (
  alertId: number
): Promise<AlertTypeApi | null> => {
  return apiInstance
    .get(`/api/v1/alerts/${alertId.toString()}`)
    .then((response: AxiosResponse) => {
      try {
        const result = apiAlertResponseSchema.safeParse(response.data);
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

export const getUnlabelledLatestAlerts = async (): Promise<AlertTypeApi[]> => {
  return apiInstance
    .get('/api/v1/alerts/unlabeled/latest')
    .then((response: AxiosResponse) => {
      try {
        const result = apiAlertListResponseSchema.safeParse(response.data);
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

export const getAlertsByFilters = async (
  fromDate: string,
  limit: number,
  offset: number
): Promise<AlertTypeApi[]> => {
  const params = {
    from_date: fromDate,
    limit,
    offset,
  };
  return apiInstance
    .get('/api/v1/alerts/all/fromdate', { params })
    .then((response: AxiosResponse) => {
      try {
        const result = apiAlertListResponseSchema.safeParse(response.data);
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

export const exportAlerts = async (
  fromDate: string,
  toDate: string
): Promise<Blob> => {
  return apiInstance
    .get('/api/v1/alerts/export', {
      params: { from_date: fromDate, to_date: toDate },
      responseType: 'blob',
    })
    .then((response: AxiosResponse<Blob>) => response.data)
    .catch((err: unknown) => {
      console.error(err);
      throw err;
    });
};

export const getDetectionsPage = async (
  sequenceId: number,
  offset: number,
  limit: number
): Promise<DetectionType[]> => {
  return apiInstance
    .get(`/api/v1/sequences/${sequenceId.toString()}/detections`, {
      params: { offset, limit, desc: false, with_crop: true },
    })
    .then((response: AxiosResponse) => {
      try {
        const result = apiDetectionListResponseSchema.safeParse(response.data);
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
  label: string | null
) => {
  return apiInstance
    .patch(`/api/v1/sequences/${sequenceId.toString()}/label`, {
      is_wildfire: label,
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
