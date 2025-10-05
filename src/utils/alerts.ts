import { difference, isEmpty, uniqWith } from 'lodash';
import moment from 'moment-timezone';

import type { SequenceType } from '../services/alerts';
import type { CameraType } from '../services/camera';
import { convertStrToEpoch } from './dates';

export interface AlertType {
  id: string; // Concat of all the sequences id
  startedAt: string | null; // Start date of the main sequence
  sequences: SequenceWithCameraInfoType[]; // List of grouped sequences
  eventSmokeLocation?: [number, number];
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
}

/*
 * Its goal is to group sequences using their event_groups property which is returned by the API
 * This grouping should soon be done within the API, so this is kind of quick and dirty
 */
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

    const indexOfEventGroupsInTheOldestSequence =
      oldestSequence.event_groups?.findIndex((eventGroup) =>
        isSameArrayIgnoringOrder(eventGroup, idSequenceList)
      );

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
          camera:
            camerasList.find((camera) => camera.id == sequence.camera_id) ??
            null,
          startedAt: sequence.started_at,
          lastSeenAt: sequence.last_seen_at,
          azimuth: sequence.azimuth,
          coneAzimuth: sequence.cone_azimuth,
          coneAngle: sequence.cone_angle,
          labelWildfire: (sequence.is_wildfire as LabelWildfireValues) ?? null,
        })),
      eventSmokeLocation:
        indexOfEventGroupsInTheOldestSequence != undefined
          ? oldestSequence.event_smoke_locations?.[
              indexOfEventGroupsInTheOldestSequence
            ]
          : undefined,
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

const isSameArrayIgnoringOrder = (arrayOne: number[], arrayTwo: number[]) => {
  return (
    arrayOne.length === arrayTwo.length &&
    isEmpty(difference(arrayTwo.sort(), arrayOne.sort()))
  );
};

const calculateIdSequencesGrouped = (sequenceList: SequenceType[]) => {
  return uniqWith(
    sequenceList.flatMap(
      (sequence) => sequence.event_groups ?? [[sequence.id]]
    ),
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
    ? convertStrToEpoch(sequence.started_at)
    : moment.now();
};
