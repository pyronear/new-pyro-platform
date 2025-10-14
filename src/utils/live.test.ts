import { getMoveToAzimuth } from './live';

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
  it('should return undefined', () => {
    const result = getMoveToAzimuth(5, [], []);
    expect(result).toEqual(undefined);
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
