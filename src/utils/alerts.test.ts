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
const createSequence = (
  id: number,
  cameraId: number,
  eventGroup: number[][],
  eventLocation: [number, number][]
) => {
  return {
    id,
    camera_id: cameraId,
    azimuth: 120,
    cone_azimuth: 120,
    cone_angle: 120,
    is_wildfire: 'other',
    started_at: '2025-10-05T13:00:00.664573',
    last_seen_at: '2025-10-05T13:00:00.664573',
    event_groups: eventGroup,
    event_smoke_locations: eventLocation,
  };
};

describe('convertSequencesToAlerts', () => {
  it('should return alerts with one eventgroup', () => {
    const sequence1 = createSequence(1, 1, [[1, 2]], [[48, 2]]);
    const sequence2 = createSequence(2, 2, [[1, 2]], [[48, 2]]);
    const sequence3 = createSequence(3, 3, [[3]], [[41, 2]]);
    sequence2.started_at = '2025-10-05T12:59:00.664573'; // before 1
    const result = convertSequencesToAlerts(
      [sequence1, sequence2, sequence3],
      []
    );
    expect(result.length).toEqual(2);
    expect(result[0].id).toEqual('1_2');
    expect(result[1].id).toEqual('3');
    expect(result[0].eventSmokeLocation).toEqual([48, 2]);
    expect(result[0].startedAt).toEqual('2025-10-05T12:59:00.664573');
    expect(result[0].sequences.length).toEqual(2);
    expect(result[0].sequences[0].id).toEqual(2);
    expect(result[0].sequences[1].id).toEqual(1);
  });
  it('should return alerts with one eventgroup but multiples sequences', () => {
    const sequence1 = createSequence(1, 1, [[1, 4, 2]], [[48, 2]]);
    const sequence2 = createSequence(2, 2, [[1, 2, 4]], [[48, 2]]);
    const sequence3 = createSequence(3, 3, [[3]], [[41, 2]]);
    const sequence4 = createSequence(4, 4, [[4, 2, 1]], [[41, 2]]);
    sequence2.started_at = '2025-10-05T12:59:00.664573'; // before 1
    sequence4.started_at = '2025-10-05T13:01:00.664573'; // after 1
    const result = convertSequencesToAlerts(
      [sequence1, sequence2, sequence3, sequence4],
      []
    );
    expect(result.length).toEqual(2);
    expect(result[0].id).toEqual('1_2_4');
    expect(result[1].id).toEqual('3');
    expect(result[0].eventSmokeLocation).toEqual([48, 2]);
    expect(result[0].startedAt).toEqual('2025-10-05T12:59:00.664573');
    expect(result[0].sequences.length).toEqual(3);
    expect(result[0].sequences[0].id).toEqual(2);
    expect(result[0].sequences[1].id).toEqual(1);
    expect(result[0].sequences[2].id).toEqual(4);
  });
  it('should return alerts with multiple eventgroup', () => {
    const sequence1 = createSequence(
      1,
      1,
      [
        [1, 2],
        [1, 3],
      ],
      [
        [48, 2],
        [14, 6],
      ]
    );
    const sequence2 = createSequence(2, 2, [[1, 2]], [[48, 2]]);
    const sequence3 = createSequence(3, 3, [[3, 1]], [[14, 6]]);
    sequence2.started_at = '2025-10-05T12:59:00.664573'; // before 1
    sequence3.started_at = '2025-10-05T13:02:00.664573'; // after 1

    const result = convertSequencesToAlerts(
      [sequence1, sequence2, sequence3],
      []
    );

    expect(result.length).toEqual(2);

    expect(result[0].id).toEqual('1_2');
    expect(result[1].id).toEqual('1_3');
    expect(result[0].eventSmokeLocation).toEqual([48, 2]);
    expect(result[1].eventSmokeLocation).toEqual([14, 6]);

    expect(result[0].sequences.length).toEqual(2);
    expect(result[0].sequences[0].id).toEqual(2);
    expect(result[0].sequences[1].id).toEqual(1);

    expect(result[1].sequences.length).toEqual(2);
    expect(result[1].sequences[0].id).toEqual(1);
    expect(result[1].sequences[1].id).toEqual(3);
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
      id: '',
      startedAt: null,
      sequences: [
        {
          id: 1,
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
          event_groups: [],
          event_smoke_locations: [],
          camera_id: 1,
          last_seen_at: null,
          azimuth: null,
          cone_azimuth: 0,
          cone_angle: 0,
          is_wildfire: null,
          started_at: '2025-02-25T05:37:03',
        },
        {
          id: 2,
          event_groups: [],
          event_smoke_locations: [],
          camera_id: 1,
          last_seen_at: null,
          azimuth: null,
          cone_azimuth: 0,
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
          event_groups: [],
          event_smoke_locations: [],
          camera_id: 1,
          last_seen_at: null,
          azimuth: null,
          cone_azimuth: 0,
          cone_angle: 0,
          is_wildfire: null,
          started_at: '2025-02-25T05:37:03',
        },
        {
          id: 2,
          event_groups: [],
          event_smoke_locations: [],
          camera_id: 1,
          last_seen_at: null,
          azimuth: null,
          cone_azimuth: 0,
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
