import type { SequenceType } from '../services/alerts';
import type { CameraType } from '../services/camera';

export interface AlertType {
  id: number; // Id of the main sequence
  startedAt: string | null; // Start date of the main sequence
  sequences: SequenceWithCameraInfoType[]; // List of grouped sequences
}

export interface SequenceWithCameraInfoType {
  id: number;
  camera: CameraType | null;
  startedAt: string | null;
  lastSeenAt: string | null;
  azimuth: number | null;
  coneAzimuth: number;
  coneAngle: number;
  isWildfire: boolean | null;
}

export const convertSequencesToAlerts = (
  sequencesList: SequenceType[],
  camerasList: CameraType[]
): AlertType[] => {
  // TODO : group sequences with triangulation
  return sequencesList.map((sequence) => {
    return {
      id: sequence.id,
      startedAt: sequence.started_at,
      sequences: [
        {
          id: sequence.id,
          camera:
            camerasList.find((camera) => camera.id == sequence.camera_id) ??
            null,
          startedAt: sequence.started_at,
          lastSeenAt: sequence.last_seen_at,
          azimuth: sequence.azimuth,
          coneAzimuth: sequence.cone_azimuth,
          coneAngle: sequence.cone_angle,
          isWildfire: sequence.is_wildfire,
        },
      ],
    };
  });
};

export const countUnlabelledSequences = (
  sequences: SequenceWithCameraInfoType[]
) => sequences.filter((sequence) => sequence.isWildfire === null).length;
