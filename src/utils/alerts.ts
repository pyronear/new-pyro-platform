import { DateTime } from 'luxon';

import type { AlertTypeApi, SequenceTypeApi } from '../services/alerts';
import type { CameraType } from '../services/camera';
import { convertIsoToUnix } from './dates';

export interface AlertType {
  id: number;
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
  azimuth: number;
  coneAngle: number;
  labelWildfire: LabelWildfireValues;
}

/*
 * Its goal is to group sequences using their event_groups property which is returned by the API
 * This grouping should soon be done within the API, so this is kind of quick and dirty
 */
export const mapAlertTypeApiToAlertType = (
  alertListDto: AlertTypeApi[],
  camerasList: CameraType[]
): AlertType[] => {
  return alertListDto.map((alertDto) => {
    return {
      id: alertDto.id,
      startedAt: alertDto.started_at,
      eventSmokeLocation:
        alertDto.lat && alertDto.lon ? [alertDto.lat, alertDto.lon] : undefined,
      sequences: alertDto.sequences
        // Sort by date ASC
        .sort((s1, s2) => (getDateOrNowNb(s1) > getDateOrNowNb(s2) ? 1 : -1))
        .map((sequence) => ({
          id: sequence.id,
          camera:
            camerasList.find((camera) => camera.id == sequence.camera_id) ??
            null,
          startedAt: sequence.started_at,
          lastSeenAt: sequence.last_seen_at,
          azimuth: sequence.sequence_azimuth,
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

const getDateOrNowNb = (sequence: SequenceTypeApi) => {
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

export const hasNewAlertSince = (
  alertList: AlertTypeApi[],
  previousDataUpdatedAt: number
) => {
  return alertList.some((sequence) => {
    if (!sequence.started_at) {
      return false;
    }
    const sequenceCreationTime = convertIsoToUnix(sequence.started_at) * 1000;
    return sequenceCreationTime >= previousDataUpdatedAt;
  });
};
