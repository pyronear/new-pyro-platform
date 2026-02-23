import { uniqWith } from 'lodash';
import { DateTime } from 'luxon';

import type { SequenceType } from '../services/alerts';
import type { CameraType } from '../services/camera';
import { convertIsoToUnix } from './dates';

export interface AlertType {
  id: string; // Concat of all the sequences id
  startedAt: string | null; // Start date of the main sequence
  sequences: SequenceWithCameraInfoType[]; // List of grouped sequences
}

export type LabelWildfireValues =
  | 'wildfire_smoke'
  | 'other_smoke'
  | 'other'
  | null;

export interface SequenceWithCameraInfoType {
  id: number;
  poseId: number | null;
  camera: CameraType | null;
  startedAt: string | null;
  lastSeenAt: string | null;
  azimuth: number | null;
  coneAzimuth: number;
  coneAngle: number;
  labelWildfire: LabelWildfireValues;
}

export const convertSequencesToAlerts = (
  sequencesList: SequenceType[],
  camerasList: CameraType[]
): AlertType[] => {
  // An event group basically defines an "alert" (i.e. a list of one or more sequences)
  const idSequencesGrouped = calculateIdSequencesGrouped(sequencesList);

  return idSequencesGrouped.map((idSequenceList) => {
    const sequencesOfTheGroup = sequencesList.filter((sequence) =>
      idSequenceList.includes(sequence.id)
    );
    if (sequencesOfTheGroup.length === 0) {
      throw new Error('should never happen');
    }
    const oldestSequence = calculateOldestSequence(sequencesOfTheGroup);

    return {
      id: sequencesOfTheGroup
        .map((s) => s.id)
        .sort()
        .join('_'),
      startedAt: oldestSequence.started_at,
      sequences: sequencesOfTheGroup
        // Sort by date ASC
        .sort((s1, s2) => (getDateOrNowNb(s1) > getDateOrNowNb(s2) ? 1 : -1))
        .map((sequence) => ({
          id: sequence.id,
          poseId: sequence.pose_id,
          camera:
            camerasList.find((camera) => camera.id == sequence.camera_id) ??
            null,
          startedAt: sequence.started_at,
          lastSeenAt: sequence.last_seen_at,
          azimuth: sequence.camera_azimuth,
          coneAzimuth: sequence.sequence_azimuth,
          coneAngle: sequence.cone_angle,
          labelWildfire: (sequence.is_wildfire as LabelWildfireValues) ?? null,
        })),
    };
  });
};

export const countUnlabelledSequences = (
  sequences: SequenceWithCameraInfoType[]
) => sequences.filter((sequence) => sequence.labelWildfire === null).length;

export const formatAzimuth = (azimuth: number | null, precision = 0) => {
  return azimuth ? `${azimuth.toFixed(precision)}°` : '';
};

export const formatPositionWithoutTronc = (
  lat: number | undefined,
  lon: number | undefined
) => {
  if (!lat && !lon) {
    return '';
  }
  return `${lat}, ${lon}`;
};

export const formatPosition = (
  lat: number | undefined,
  lon: number | undefined
) => {
  if (!lat && !lon) {
    return '';
  }
  return `${formatOneCoordinate(lat)}, ${formatOneCoordinate(lon)}`;
};
const formatOneCoordinate = (coordinate: number | undefined) => {
  return coordinate ? coordinate.toFixed(6) : '-';
};

const isSameArrayIgnoringOrder = (arrayOne: number[], arrayTwo: number[]) => {
  if (arrayOne.length !== arrayTwo.length) return false;
  const sorted1 = [...arrayOne].sort();
  const sorted2 = [...arrayTwo].sort();
  return sorted1.every((val, i) => val === sorted2[i]);
};

const calculateIdSequencesGrouped = (sequenceList: SequenceType[]) => {
  return uniqWith(
    sequenceList.map((sequence) => [sequence.id]),
    isSameArrayIgnoringOrder
  );
};

const calculateOldestSequence = (sequenceList: SequenceType[]) => {
  const sequencesDates: number[] = sequenceList.map((sequence) =>
    getDateOrNowNb(sequence)
  );
  const indexOfSmallestDate = sequencesDates.indexOf(
    Math.min(...sequencesDates)
  );

  return sequenceList[indexOfSmallestDate];
};

const getDateOrNowNb = (sequence: SequenceType) => {
  // default date is now. should be older than all others
  return sequence.started_at != null
    ? convertIsoToUnix(sequence.started_at)
    : DateTime.now().toUnixInteger();
};

export const extractCameraListFromAlert = (alert: AlertType) => {
  return alert.sequences
    .map((sequence) => sequence.camera)
    .filter((cameraNullable) => !!cameraNullable);
};

export const getSequenceByCameraId = (alert: AlertType, cameraId: number) => {
  return alert.sequences.find((sequence) => sequence.camera?.id === cameraId);
};

export const hasNewSequenceSince = (
  sequenceList: SequenceType[],
  previousDataUpdatedAt: number
) => {
  if (previousDataUpdatedAt === 0) return false;
  return sequenceList.some((sequence) => {
    if (!sequence.started_at) {
      return false;
    }
    const sequenceCreationTime = convertIsoToUnix(sequence.started_at) * 1000;
    return sequenceCreationTime > previousDataUpdatedAt;
  });
};

export const isInTheList = (
  alertsList: AlertType[],
  alert: AlertType | null
) => {
  const indexSelectedAlert = alertsList.findIndex((a) => a.id === alert?.id);
  return indexSelectedAlert != -1;
};
