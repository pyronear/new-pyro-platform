import type { AlertType } from './alerts';
import type { CameraFullInfosType } from './camera';
import { getMoveToAzimuth, getMoveToAzimuthFromAlert } from './live';

const POSES = [
  { id: 1, azimuth: 10, patrol_id: 0, camera_id: 5 },
  { id: 2, azimuth: 40, patrol_id: 1, camera_id: 5 },
  { id: 3, azimuth: 90, patrol_id: 2, camera_id: 5 },
  { id: 4, azimuth: 150, patrol_id: 3, camera_id: 5 },
];

describe('getMoveToAzimuth', () => {
  it('should return the closest pose to left', () => {
    const result = getMoveToAzimuth(5, POSES);
    expect(result).toEqual({
      poseId: 0,
      degrees: 5,
      speed: 5,
      direction: 'Left',
    });
  });
  it('should return null', () => {
    const result = getMoveToAzimuth(5, []);
    expect(result).toEqual(null);
  });
  it('should return the closest pose to right', () => {
    const result = getMoveToAzimuth(98, POSES);
    expect(result).toEqual({
      poseId: 2,
      degrees: 8,
      speed: 5,
      direction: 'Right',
    });
  });
  it('should return the closest pose modulo 360 to left', () => {
    const result = getMoveToAzimuth(355, POSES);
    expect(result).toEqual({
      poseId: 0,
      degrees: 15,
      speed: 5,
      direction: 'Left',
    });
  });
  it('should return the closest pose modulo 360 to right', () => {
    const result = getMoveToAzimuth(10, [
      { id: 1, azimuth: 50, patrol_id: 0, camera_id: 5 },
      { id: 2, azimuth: 60, patrol_id: 1, camera_id: 5 },
      { id: 3, azimuth: 90, patrol_id: 2, camera_id: 5 },
      { id: 4, azimuth: 350, patrol_id: 3, camera_id: 5 },
    ]);
    expect(result).toEqual({
      poseId: 3,
      degrees: 20,
      speed: 5,
      direction: 'Right',
    });
  });
  it('should return the pose if equal', () => {
    const result = getMoveToAzimuth(10, POSES);
    expect(result).toEqual({
      poseId: 0,
      degrees: 0,
      speed: 5,
      direction: undefined,
    });
  });
});

describe('getMoveToAzimuthFromAlert', () => {
  it('should find the right sequence', () => {
    const alert: AlertType = {
      sequences: [
        {
          id: 15,
          camera: {
            id: 15,
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
            poses: POSES,
          },
          startedAt: null,
          lastSeenAt: null,
          azimuth: 0,
          coneAngle: 0,
          labelWildfire: null,
        },
        {
          id: 18,
          camera: {
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
            poses: POSES,
          },
          startedAt: null,
          lastSeenAt: null,
          azimuth: 5,
          coneAngle: 0,
          labelWildfire: null,
        },
      ],
      id: 1,
      startedAt: null,
    };
    const camera: CameraFullInfosType = {
      id: 1,
      poses: POSES,
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
    const result = getMoveToAzimuthFromAlert(camera, alert);
    expect(result).toEqual({
      poseId: 0,
      degrees: 5,
      speed: 5,
      direction: 'Left',
    });
  });
  it('should return null', () => {
    const camera: CameraFullInfosType = {
      id: 1,
      poses: POSES,
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
    const result = getMoveToAzimuthFromAlert(camera, undefined);
    expect(result).toEqual(null);
  });
});
