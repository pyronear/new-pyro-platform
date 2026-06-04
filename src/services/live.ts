import type { AxiosResponse } from 'axios';
import * as z from 'zod/v4';

import type { MovementCommand } from '@/utils/live';

import appConfig from './appConfig';
import { apiInstance } from './axios';

// Camera control commands block on the Pi until the PTZ/zoom motor settles,
// which can far exceed the global API timeout. Zoom is the slowest (settle up
// to ~10s), so it gets its own, longer timeout.
const controlTimeout = () => ({
  timeout: appConfig.getConfig().CAMERA_CONTROL_TIMEOUT_MS,
});
const zoomTimeout = () => ({
  timeout: appConfig.getConfig().CAMERA_ZOOM_TIMEOUT_MS,
});

const apiCameraInfosResponseSchema = z.object({
  ip: z.string(),
  name: z.string(),
  azimuths: z.array(z.number()),
  poses: z.array(z.number()),
  id: z.string(),
  type: z.string(),
  camera_id: z.string(),
  adapter: z.string(),
});

const apiCamerasInfosResponseSchema = z.object({
  cameras: z.array(apiCameraInfosResponseSchema),
});

export type CameraInfosFromPi = z.infer<typeof apiCameraInfosResponseSchema>;

export const getCamerasInfos = async (
  cameraId: number
): Promise<CameraInfosFromPi[]> => {
  return apiInstance
    .get(`/api/v1/cameras/${cameraId}/camera_infos`)
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

export const startStreaming = async (cameraId: number): Promise<void> => {
  return apiInstance
    .post(`/api/v1/cameras/${cameraId}/stream/start`)
    .then(() => {
      return;
    })
    .catch((err: unknown) => {
      console.error(err);
      throw err;
    });
};

export const stopStreaming = async (cameraId: number): Promise<void> => {
  return apiInstance
    .post(`/api/v1/cameras/${cameraId}/stream/stop`)
    .then(() => {
      return;
    })
    .catch((err: unknown) => {
      console.error(err);
      throw err;
    });
};
const startPatrol = async (cameraId: number): Promise<void> => {
  return apiInstance
    .post(`/api/v1/cameras/${cameraId}/patrol/start`)
    .then(() => {
      return;
    })
    .catch((err: unknown) => {
      console.error(err);
      throw err;
    });
};

const stopPatrol = async (cameraId: number): Promise<void> => {
  return apiInstance
    .post(`/api/v1/cameras/${cameraId}/patrol/stop`)
    .then(() => {
      return;
    })
    .catch((err: unknown) => {
      console.error(err);
      throw err;
    });
};

export const stopPatrolThenStartStreaming = async (
  cameraId: number
): Promise<void> => {
  return stopPatrol(cameraId).then(() => startStreaming(cameraId));
};

export const stopStreamingThenStartPatrol = async (
  cameraId: number
): Promise<void> => {
  return stopStreaming(cameraId).then(() => startPatrol(cameraId));
};

export const zoomCamera = async (
  cameraId: number,
  level: number
): Promise<void> => {
  return apiInstance
    .post(
      `/api/v1/cameras/${cameraId}/control/zoom/${level}`,
      null,
      zoomTimeout()
    )
    .then(() => {
      return;
    })
    .catch((err: unknown) => {
      console.error(err);
      throw err;
    });
};

export type CameraDirectionType = 'Up' | 'Down' | 'Left' | 'Right';

export const moveCamera = async (
  cameraId: number,
  direction?: CameraDirectionType,
  speed?: number,
  poseId?: number,
  degrees?: number
): Promise<void> => {
  return apiInstance
    .post(`/api/v1/cameras/${cameraId}/control/move`, null, {
      ...controlTimeout(),
      params: {
        direction,
        speed,
        pose_id: poseId,
        degrees,
      },
    })
    .then(() => {
      return;
    })
    .catch((err: unknown) => {
      console.error(err);
      throw err;
    });
};

export const moveCameraToAAzimuth = async (
  cameraId: number,
  move: MovementCommand
) => {
  return moveCamera(
    cameraId,
    undefined,
    undefined,
    move.poseId,
    undefined
  ).then(() => {
    if (move.degrees !== 0) {
      return moveCamera(
        cameraId,
        move.direction,
        move.speed,
        undefined,
        move.degrees
      );
    }
  });
};

export const stopCamera = async (cameraId: number): Promise<void> => {
  return apiInstance
    .post(`/api/v1/cameras/${cameraId}/control/stop`, null, controlTimeout())
    .then(() => {
      return;
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
  return fetch(`/config/${import.meta.env.VITE_FILE_SITES_LIVE_ACCESS}`)
    .then((r) => r.json())
    .then((response) => {
      const result = apiSitesLiveAccessResponseSchema.safeParse(response);
      if (result.success) {
        return result.data[username] ?? [];
      }
      return [];
    });
};
