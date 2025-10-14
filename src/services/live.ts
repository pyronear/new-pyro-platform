import type { AxiosResponse } from 'axios';
import * as z from 'zod/v4';

import type { MovementCommand } from '@/utils/live';

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

export const startStreaming = async (cameraIp: string): Promise<void> => {
  return liveInstance
    .post(`/stream/start_stream/${cameraIp}`)
    .then(() => {
      return;
    })
    .catch((err: unknown) => {
      console.error(err);
      throw err;
    });
};

export const stopStreaming = async (): Promise<void> => {
  return liveInstance
    .post('/stream/stop_stream')
    .then(() => {
      return;
    })
    .catch((err: unknown) => {
      console.error(err);
      throw err;
    });
};
const startPatrol = async (cameraIp: string): Promise<void> => {
  return liveInstance
    .post('/patrol/start_patrol', null, { params: { camera_ip: cameraIp } })
    .then(() => {
      return;
    })
    .catch((err: unknown) => {
      console.error(err);
      throw err;
    });
};

const stopPatrol = async (cameraIp: string): Promise<void> => {
  return liveInstance
    .post('/patrol/stop_patrol', null, { params: { camera_ip: cameraIp } })
    .then(() => {
      return;
    })
    .catch((err: unknown) => {
      console.error(err);
      throw err;
    });
};

export const stopPatrolThenStartStreaming = async (
  cameraIp: string
): Promise<void> => {
  return stopPatrol(cameraIp).then(() => startStreaming(cameraIp));
};

export const stopStreamingThenStartPatrol = async (
  cameraIp: string
): Promise<void> => {
  return stopStreaming().then(() => startPatrol(cameraIp));
};

export const zoomCamera = async (
  cameraIp: string,
  level: number
): Promise<void> => {
  return liveInstance
    .post(`/control/zoom/${cameraIp}/${level}`)
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
  cameraIp: string,
  direction?: CameraDirectionType,
  speed?: number,
  poseId?: number,
  degrees?: number
): Promise<void> => {
  return liveInstance
    .post('/control/move', null, {
      params: {
        camera_ip: cameraIp,
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
  cameraIp: string,
  move: MovementCommand
) => {
  return moveCamera(
    cameraIp,
    undefined,
    undefined,
    move.poseId,
    undefined
  ).then(() => {
    if (move.degrees !== 0) {
      return moveCamera(
        cameraIp,
        move.direction,
        move.speed,
        undefined,
        move.degrees
      );
    }
  });
};

export const stopCamera = async (cameraIp: string): Promise<void> => {
  return liveInstance
    .post(`/control/stop/${cameraIp}`)
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
  return fetch(`/${import.meta.env.VITE_FILE_SITES_LIVE_ACCESS}`)
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
