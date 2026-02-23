import type { AlertType } from './alerts';
import type { CameraFullInfosType } from './camera';
import { getMoveToAzimuth, getMoveToAzimuthFromAlert } from './live';

describe('getMoveToAzimuth', () => {
  it('should return the closest pose to left', () => {
    const result = getMoveToAzimuth(5, [10, 40, 90, 150], [0, 1, 2, 3]);
    expect(result).toEqual({
      poseId: 0,
      degrees: 5,
      speed: 5,
      direction: 'Left',
    });
  });
  it('should return null', () => {
    const result = getMoveToAzimuth(5, [], []);
    expect(result).toEqual(null);
  });
  it('should return the closest pose to right', () => {
    const result = getMoveToAzimuth(98, [10, 40, 90, 150], [0, 1, 2, 3]);
    expect(result).toEqual({
      poseId: 2,
      degrees: 8,
      speed: 5,
      direction: 'Right',
    });
  });
  it('should return the closest pose modulo 360 to left', () => {
    const result = getMoveToAzimuth(355, [10, 40, 90, 150], [0, 1, 2, 3]);
    expect(result).toEqual({
      poseId: 0,
      degrees: 15,
      speed: 5,
      direction: 'Left',
    });
  });
  it('should return the closest pose modulo 360 to right', () => {
    const result = getMoveToAzimuth(10, [50, 60, 90, 350], [0, 1, 2, 3]);
    expect(result).toEqual({
      poseId: 3,
      degrees: 20,
      speed: 5,
      direction: 'Right',
    });
  });
  it('should return the pose if equal', () => {
    const result = getMoveToAzimuth(10, [10, 40, 90, 150], [0, 1, 2, 3]);
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
          },
          startedAt: null,
          lastSeenAt: null,
          azimuth: null,
          poseId: null,
          coneAzimuth: 0,
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
          },
          startedAt: null,
          lastSeenAt: null,
          azimuth: null,
          poseId: null,
          coneAzimuth: 5,
          coneAngle: 0,
          labelWildfire: null,
        },
      ],
      id: '1',
      startedAt: null,
    };
    const camera: CameraFullInfosType = {
      id: 1,
      azimuths: [10, 40, 90, 150],
      poses: [0, 1, 2, 3],
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
      azimuths: [10, 40, 90, 150],
      poses: [0, 1, 2, 3],
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
