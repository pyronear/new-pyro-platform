import type { CameraType } from '@/services/camera';

import {
  type AlertType,
  extractCameraListFromAlert,
  formatAzimuth,
  formatPosition,
  getSequenceAzimuthAxis,
  hasNewAlertSince,
  type SequenceWithCameraInfoType,
} from './alerts';

describe('formatConeAzimuth', () => {
  it('should return empty string if is null', () => {
    const result = formatAzimuth(null);
    expect(result).toBe('');
  });

  it('should return 22° if a float', () => {
    const result = formatAzimuth(22.4);
    expect(result).toBe('22°');
  });
  it('should return 22.5° if a float with precision of 1', () => {
    const result = formatAzimuth(22.5, 1);
    expect(result).toBe('22.5°');
  });
  it('should wrap a negative azimuth back into [0, 360[', () => {
    expect(formatAzimuth(-10)).toBe('350°');
    expect(formatAzimuth(-370)).toBe('350°');
  });
  it('should wrap an azimuth greater than 360 back into [0, 360[', () => {
    expect(formatAzimuth(365)).toBe('5°');
    expect(formatAzimuth(360)).toBe('0°');
  });
  it('should round before wrapping so it never displays 360°', () => {
    expect(formatAzimuth(359.8)).toBe('0°');
  });
});

describe('getSequenceAzimuthAxis', () => {
  const createSequence = (
    cameraAzimuth: number | null,
    angleOfView: number | null
  ): SequenceWithCameraInfoType => ({
    id: 1,
    poseId: null,
    camera: { angle_of_view: angleOfView } as CameraType,
    startedAt: null,
    lastSeenAt: null,
    azimuth: 0,
    cameraAzimuth,
    coneAngle: 0,
    labelWildfire: null,
  });

  it('should return the camera azimuth and its angle of view', () => {
    expect(getSequenceAzimuthAxis(createSequence(230.4, 54.2))).toEqual({
      center: 230.4,
      range: 54.2,
    });
  });

  it('should keep an azimuth of 0 (due north)', () => {
    expect(getSequenceAzimuthAxis(createSequence(0, 54.2))).toEqual({
      center: 0,
      range: 54.2,
    });
  });

  it('should return null when the camera azimuth is unknown', () => {
    expect(getSequenceAzimuthAxis(createSequence(null, 54.2))).toBeNull();
  });

  it('should return null when the angle of view is unknown', () => {
    expect(getSequenceAzimuthAxis(createSequence(230.4, null))).toBeNull();
  });

  it('should return null when the sequence has no camera', () => {
    expect(
      getSequenceAzimuthAxis({ ...createSequence(230.4, 54.2), camera: null })
    ).toBeNull();
  });
});
describe('formatPosition', () => {
  it('should return empty string if is null', () => {
    const result = formatPosition(undefined, undefined);
    expect(result).toBe('');
  });

  it('should return one coordinate if lon present', () => {
    const result = formatPosition(undefined, 12.554128494);
    expect(result).toBe('-, 12.554128');
  });
  it('should return one coordinate if lat present', () => {
    const result = formatPosition(12.554128494, undefined);
    expect(result).toBe('12.554128, -');
  });
  it('should return both coordinates if present', () => {
    const result = formatPosition(48.852501257, 2.337761575);
    expect(result).toBe('48.852501, 2.337762');
  });
  it('should return both coordinates if present', () => {
    const result = formatPosition(48.85251, 2.33776);
    expect(result).toBe('48.852510, 2.337760');
  });
});

describe('extractCameraListFromAlert', () => {
  it('should return list', () => {
    const camera1 = {
      id: 1,
      organization_id: 0,
      name: '',
      angle_of_view: null,
      elevation: null,
      lat: 0,
      lon: 0,
      is_trustable: false,
      last_active_at: null,
      last_image: null,
      last_image_url: null,
      created_at: null,
      poses: [],
    };
    const camera2 = {
      id: 1,
      organization_id: 0,
      name: '',
      angle_of_view: null,
      elevation: null,
      lat: 0,
      lon: 0,
      is_trustable: false,
      last_active_at: null,
      last_image: null,
      last_image_url: null,
      created_at: null,
      poses: [],
    };

    const alert: AlertType = {
      id: 1,
      startedAt: null,
      sequences: [
        {
          id: 1,
          poseId: null,
          camera: camera1,
          lastSeenAt: null,
          azimuth: 0,
          cameraAzimuth: null,
          coneAngle: 0,
          labelWildfire: null,
          startedAt: null,
        },
        {
          id: 2,
          poseId: null,
          camera: camera2,
          lastSeenAt: null,
          azimuth: 0,
          cameraAzimuth: null,
          coneAngle: 0,
          labelWildfire: null,
          startedAt: null,
        },
      ],
    };
    const result = extractCameraListFromAlert(alert);
    expect(result).toStrictEqual([camera1, camera2]);
  });
});
describe('hasNewSequenceSince', () => {
  it('should return false if empty', () => {
    const result = hasNewAlertSince([], 1740476223000); //2025-02-25T09:37:03
    expect(result).toBeFalsy();
  });

  it('should return false if nothing new', () => {
    const result = hasNewAlertSince(
      [
        {
          id: 1,
          started_at: '2025-02-25T05:37:03',
          sequences: [],
          organization_id: 0,
          lat: null,
          lon: null,
          last_seen_at: '',
        },
        {
          id: 2,
          started_at: '2025-02-25T08:37:03',
          sequences: [],
          organization_id: 0,
          lat: null,
          lon: null,
          last_seen_at: '',
        },
      ],
      1740476223000
    ); //2025-02-25T09:37:03
    expect(result).toBeFalsy();
  });
  it('should return true if one new', () => {
    const result = hasNewAlertSince(
      [
        {
          id: 1,
          started_at: '2025-02-25T05:37:03',
          sequences: [],
          organization_id: 0,
          lat: null,
          lon: null,
          last_seen_at: '',
        },
        {
          id: 2,
          started_at: '2025-02-25T09:38:03',
          sequences: [],
          organization_id: 0,
          lat: null,
          lon: null,
          last_seen_at: '',
        },
      ],
      1740476223000
    ); //2025-02-25T09:37:03
    expect(result).toBeTruthy();
  });
});
