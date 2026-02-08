import {
  type AlertType,
  extractCameraListFromAlert,
  formatAzimuth,
  formatPosition,
  hasNewAlertSince,
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
          camera: camera1,
          lastSeenAt: null,
          azimuth: 0,

          coneAngle: 0,
          labelWildfire: null,
          startedAt: null,
        },
        {
          id: 2,
          camera: camera2,
          lastSeenAt: null,
          azimuth: 0,
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
