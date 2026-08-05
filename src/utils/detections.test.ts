import {
  calculateDetectionsPages,
  calculateNbDetectionsToLoad,
} from '@/utils/detections.ts';

describe('calculateDetectionsPages', () => {
  it('should return no page', () => {
    const result = calculateDetectionsPages(0);
    expect(result).toHaveLength(0);
  });
  it('should return one page if less than max per page', () => {
    const result = calculateDetectionsPages(8);
    expect(result).toEqual([
      {
        offset: 0,
        limit: 8,
        sampling: 1,
      },
    ]);
  });
  it('should return one page if equals max per page', () => {
    const result = calculateDetectionsPages(10);
    expect(result).toEqual([
      {
        offset: 0,
        limit: 10,
        sampling: 1,
      },
    ]);
  });
  it('should return two pages if less than twice max per page', () => {
    const result = calculateDetectionsPages(17);
    expect(result).toEqual([
      {
        offset: 0,
        limit: 10,
        sampling: 1,
      },
      {
        offset: 10,
        limit: 17,
        sampling: 1,
      },
    ]);
  });
  it('should return three pages without sampling if less than three times max per page', () => {
    const result = calculateDetectionsPages(27);
    expect(result).toEqual([
      {
        offset: 0,
        limit: 10,
        sampling: 1,
      },
      {
        offset: 10,
        limit: 17,
        sampling: 1,
      },
      {
        offset: 17,
        limit: 27,
        sampling: 1,
      },
    ]);
  });
  it('should return three pages with sampling if more than three times max per page', () => {
    const result = calculateDetectionsPages(44);
    expect(result).toEqual([
      {
        offset: 0,
        limit: 10,
        sampling: 1,
      },
      {
        offset: 10,
        limit: 34,
        sampling: 3,
      },
      {
        offset: 34,
        limit: 44,
        sampling: 1,
      },
    ]);
  });
});



describe('calculateNbDetectionsToLoad', () => {
  it('should return 0 if no page', () => {
    const result = calculateNbDetectionsToLoad([]);
    expect(result).toEqual(0);
  });
  it('should return limit if one page with less than max per page', () => {
    const result = calculateNbDetectionsToLoad([
      {
        offset: 0,
        limit: 8,
        sampling: 1,
      },
    ]);
    expect(result).toEqual(8);
  });
  it('should return page size if one page which equals max per page', () => {
    const result = calculateNbDetectionsToLoad([
      {
        offset: 0,
        limit: 10,
        sampling: 1,
      },
    ]);
    expect(result).toEqual(10);
  });
  it('should return the sum of two pages if less than twice max per page', () => {
    const result = calculateNbDetectionsToLoad([
      {
        offset: 0,
        limit: 10,
        sampling: 1,
      },
      {
        offset: 10,
        limit: 17,
        sampling: 1,
      },
    ]);
    expect(result).toEqual(17);
  });
});
