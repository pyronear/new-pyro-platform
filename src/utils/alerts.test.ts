import {
  type AlertType,
  convertSequencesToAlerts,
  extractCameraListFromAlert,
  formatAzimuth,
  formatPosition,
  hasNewSequenceSince,
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
const createSequence = (id: number, cameraId: number) => {
  return {
    id,
    camera_id: cameraId,
    pose_id: null,
    camera_azimuth: 120,
    sequence_azimuth: 120,
    cone_angle: 120,
    is_wildfire: 'other',
    started_at: '2025-10-05T13:00:00.664573',
    last_seen_at: '2025-10-05T13:00:00.664573',
  };
};

describe('convertSequencesToAlerts', () => {
  it('should create one alert per sequence', () => {
    const sequence1 = createSequence(1, 1);
    const sequence2 = createSequence(2, 2);
    const sequence3 = createSequence(3, 3);
    sequence2.started_at = '2025-10-05T12:59:00.664573';
    const result = convertSequencesToAlerts(
      [sequence1, sequence2, sequence3],
      []
    );
    expect(result.length).toEqual(3);
    expect(result[0].id).toEqual('1');
    expect(result[1].id).toEqual('2');
    expect(result[2].id).toEqual('3');
  });
  it('should map sequence fields correctly', () => {
    const sequence = createSequence(1, 1);
    const result = convertSequencesToAlerts([sequence], []);
    expect(result.length).toEqual(1);
    expect(result[0].startedAt).toEqual('2025-10-05T13:00:00.664573');
    expect(result[0].sequences.length).toEqual(1);
    expect(result[0].sequences[0].azimuth).toEqual(120);
    expect(result[0].sequences[0].coneAzimuth).toEqual(120);
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
    };

    const alert: AlertType = {
      id: '',
      startedAt: null,
      sequences: [
        {
          id: 1,
          poseId: null,
          camera: camera1,
          lastSeenAt: null,
          azimuth: null,
          coneAzimuth: 0,
          coneAngle: 0,
          labelWildfire: null,
          startedAt: null,
        },
        {
          id: 2,
          poseId: null,
          camera: camera2,
          lastSeenAt: null,
          azimuth: null,
          coneAzimuth: 0,
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
    const result = hasNewSequenceSince([], 1740476223000); //2025-02-25T09:37:03
    expect(result).toBeFalsy();
  });

  it('should return false if nothing new', () => {
    const result = hasNewSequenceSince(
      [
        {
          id: 1,
          camera_id: 1,
          pose_id: null,
          last_seen_at: null,
          camera_azimuth: null,
          sequence_azimuth: 0,
          cone_angle: 0,
          is_wildfire: null,
          started_at: '2025-02-25T05:37:03',
        },
        {
          id: 2,
          camera_id: 1,
          pose_id: null,
          last_seen_at: null,
          camera_azimuth: null,
          sequence_azimuth: 0,
          cone_angle: 0,
          is_wildfire: null,
          started_at: '2025-02-25T08:37:03',
        },
      ],
      1740476223000
    ); //2025-02-25T09:37:03
    expect(result).toBeFalsy();
  });
  it('should return true if one new', () => {
    const result = hasNewSequenceSince(
      [
        {
          id: 1,
          camera_id: 1,
          pose_id: null,
          last_seen_at: null,
          camera_azimuth: null,
          sequence_azimuth: 0,
          cone_angle: 0,
          is_wildfire: null,
          started_at: '2025-02-25T05:37:03',
        },
        {
          id: 2,
          camera_id: 1,
          pose_id: null,
          last_seen_at: null,
          camera_azimuth: null,
          sequence_azimuth: 0,
          cone_angle: 0,
          is_wildfire: null,
          started_at: '2025-02-25T09:38:03',
        },
      ],
      1740476223000
    ); //2025-02-25T09:37:03
    expect(result).toBeTruthy();
  });
});
