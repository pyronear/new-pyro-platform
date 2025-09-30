import { isEqual, uniqWith } from 'lodash';

import type { SequenceType } from '../services/alerts';
import type { CameraType } from '../services/camera';

export interface AlertType {
  id: number; // Id of the main sequence
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
  camera: CameraType | null;
  startedAt: string | null;
  lastSeenAt: string | null;
  azimuth: number | null;
  coneAzimuth: number;
  coneAngle: number;
  labelWildfire: LabelWildfireValues;
  eventSmokeLocation: [number, number];
}

/*
 * Sorry for the complexity of this function
 * Its goal is to group sequences using their event_groups property which is now returned by the API
 * This grouping should soon be done within the API, so this is kind of quick and dirty
 */
export const convertSequencesToAlerts = (
  sequencesList: SequenceType[],
  camerasList: CameraType[]
): AlertType[] => {
  const sequencesWithSortedEventGroups = sequencesList.map((sequence) => ({
    ...sequence,
    event_groups: sequence.event_groups.map((group) => group.sort()),
  }));

  // An event group basically defines an "alert" (i.e. a list of one or more sequences)
  const uniqueEventIdGroups = uniqWith(
    sequencesWithSortedEventGroups.flatMap((sequence) => sequence.event_groups),
    isEqual
  );

  return uniqueEventIdGroups.map((eventGroupIds) => {
    const sequences = sequencesList.filter((sequence) =>
      eventGroupIds.includes(sequence.id)
    );
    if (sequences.length === 0) {
      throw new Error('should never happen');
    }
    const validDates = sequences
      .map((sequence) => sequence.started_at)
      .filter((startedAt) => startedAt !== null);
    const startedAt =
      validDates.length !== 0
        ? new Date(
            Math.min(...validDates.map((date) => new Date(date).getTime()))
          ).toISOString()
        : null;
    const groupIndex = sequences[0].event_groups.findIndex((group) =>
      isEqual(group, eventGroupIds)
    );
    return {
      id: sequences[0].id,
      startedAt,
      sequences: sequencesList
        .filter((sequence) => eventGroupIds.includes(sequence.id))
        .map((sequence) => ({
          id: sequence.id,
          camera:
            camerasList.find((camera) => camera.id == sequence.camera_id) ??
            null,
          startedAt: sequence.started_at,
          lastSeenAt: sequence.last_seen_at,
          azimuth: sequence.azimuth,
          coneAzimuth: sequence.cone_azimuth,
          coneAngle: sequence.cone_angle,
          labelWildfire: (sequence.is_wildfire as LabelWildfireValues) ?? null,
          eventSmokeLocation: sequence.event_smoke_locations[groupIndex],
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
