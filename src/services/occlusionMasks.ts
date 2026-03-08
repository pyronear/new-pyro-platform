import type { AxiosResponse } from 'axios';
import * as z from 'zod/v4';

import { apiInstance } from './axios';

const occlusionMaskReadSchema = z.object({
  id: z.number(),
  pose_id: z.number(),
  mask: z.string(),
  created_at: z.iso.datetime({ local: true }),
});

export type OcclusionMaskApiType = z.infer<typeof occlusionMaskReadSchema>;

const occlusionMaskListResponseSchema = z.array(occlusionMaskReadSchema);

export const getOcclusionMasksByPose = async (
  poseId: number
): Promise<OcclusionMaskApiType[]> => {
  return apiInstance
    .get(`/api/v1/poses/${poseId.toString()}/occlusion_masks`)
    .then((response: AxiosResponse) => {
      const result = occlusionMaskListResponseSchema.safeParse(response.data);
      return result.data ?? [];
    })
    .catch((err: unknown) => {
      console.error(err);
      throw err;
    });
};

export const createOcclusionMask = async (
  poseId: number,
  mask: string
): Promise<OcclusionMaskApiType> => {
  return apiInstance
    .post('/api/v1/occlusion_masks/', { pose_id: poseId, mask })
    .then((response: AxiosResponse) => {
      const result = occlusionMaskReadSchema.safeParse(response.data);
      if (!result.success) {
        throw new Error('INVALID_API_RESPONSE');
      }
      return result.data;
    })
    .catch((err: unknown) => {
      console.error(err);
      throw err;
    });
};

export const deleteOcclusionMask = async (maskId: number): Promise<void> => {
  return apiInstance
    .delete(`/api/v1/occlusion_masks/${maskId.toString()}`)
    .then(() => undefined)
    .catch((err: unknown) => {
      console.error(err);
      throw err;
    });
};

export const deleteAllOcclusionMasksByPose = async (
  poseId: number
): Promise<void> => {
  const masks = await getOcclusionMasksByPose(poseId);
  await Promise.all(masks.map((mask) => deleteOcclusionMask(mask.id)));
};
