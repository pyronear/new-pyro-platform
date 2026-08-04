import {
  buildArrayAroundCenter,
  isFirstOrLastInList,
  isMiddleInList,
} from '@/utils/axisHelper.ts';

describe('buildArrayAroundCenter', () => {
  it('should return only center if range smaller than step', () => {
    const result = buildArrayAroundCenter(10, 62, 5);
    expect(result).toEqual([62]);
  });
  it('should return center and two items if range is twice the step', () => {
    const result = buildArrayAroundCenter(5, 62, 10);
    expect(result).toEqual([57, 62, 67]);
  });
  it('should return center and others items if range is much bigger than step', () => {
    const result = buildArrayAroundCenter(5, 62, 54.2);
    expect(result).toEqual([37, 42, 47, 52, 57, 62, 67, 72, 77, 82, 87]);
  });
  it('should return center and others items even with negative items', () => {
    const result = buildArrayAroundCenter(5, 12, 54.2);
    expect(result).toEqual([-13, -8, -3, 2, 7, 12, 17, 22, 27, 32, 37]);
  });
});

describe('isFirstOrLastInList', () => {
  it('should return true if equals first item', () => {
    const result = isFirstOrLastInList([62, 67, 72, 77, 82, 87], 0);
    expect(result).toBeTruthy();
  });
  it('should return true if equals last item', () => {
    const result = isFirstOrLastInList([62, 67, 72, 77, 82], 4);
    expect(result).toBeTruthy();
  });
  it('should return false if in middle', () => {
    const result = isFirstOrLastInList([62, 67, 72, 77, 82], 1);
    expect(result).toBeFalsy();
  });
});

describe('isMiddleInList', () => {
  it('should return true if a center exists and equals the item', () => {
    const result = isMiddleInList([62, 67, 72, 77, 82], 2);
    expect(result).toBeTruthy();
  });
  it('should return false if between first and middle', () => {
    const result = isMiddleInList([62, 67, 72, 77, 82], 1);
    expect(result).toBeFalsy();
  });
  it('should return false if no centre', () => {
    const result = isMiddleInList([62, 67, 72, 77, 82, 87], 2);
    expect(result).toBeFalsy();
  });
});
