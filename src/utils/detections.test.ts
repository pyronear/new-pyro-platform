import {
  calculateDetectionsPages,
  calculateNbDetectionsToLoad,
} from '@/utils/detections.ts';

describe('calculateDetectionsPages', () => {
  it('should return no page', () => {
    const result = calculateDetectionsPages(0, 10);
    expect(result).toHaveLength(0);
  });
  it('should return one page if less than max per page', () => {
    const result = calculateDetectionsPages(8, 10);
    expect(result).toEqual([
      {
        limit: 8,
        sampling: 1,
        desc: false,
      },
    ]);
  });
  it('should return one page if equals max per page', () => {
    const result = calculateDetectionsPages(10, 10);
    expect(result).toEqual([
      {
        limit: 10,
        sampling: 1,
        desc: false,
      },
    ]);
  });
  it('should return two pages if less than twice max per page', () => {
    const result = calculateDetectionsPages(17, 10);
    expect(result).toEqual([
      {
        limit: 10,
        sampling: 1,
        desc: false,
      },
      {
        limit: 7,
        sampling: 1,
        desc: true,
      },
    ]);
  });
  it('should return three pages without sampling if less than three times max per page', () => {
    const result = calculateDetectionsPages(27, 10);
    expect(result).toEqual([
      {
        limit: 10,
        sampling: 1,
        desc: false,
      },
      {
        offset: 10,
        limit: 7,
        sampling: 1,
        desc: false,
      },
      {
        limit: 10,
        sampling: 1,
        desc: true,
      },
    ]);
  });
  it('should return three pages with sampling if more than three times max per page', () => {
    const result = calculateDetectionsPages(44, 10);
    expect(result).toEqual([
      {
        limit: 10,
        sampling: 1,
        desc: false,
      },
      {
        offset: 10,
        limit: 10,
        sampling: 3, // 24 detections to reduce to 10 max
        desc: false,
      },
      {
        limit: 10,
        sampling: 1,
        desc: true,
      },
    ]);
  });
  it('should return three pages with sampling if 1000 detections', () => {
    const result = calculateDetectionsPages(1000, 10);
    expect(result).toEqual([
      {
        limit: 10,
        sampling: 1,
        desc: false,
      },
      {
        offset: 10,
        limit: 10,
        sampling: 98, // 980 detections to reduce to 10 max
        desc: false,
      },
      {
        limit: 10,
        sampling: 1,
        desc: true,
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
        limit: 8,
        sampling: 1,
        desc: false,
      },
    ]);
    expect(result).toEqual(8);
  });
  it('should return page size if one page which equals max per page', () => {
    const result = calculateNbDetectionsToLoad([
      {
        limit: 10,
        sampling: 1,
        desc: false,
      },
    ]);
    expect(result).toEqual(10);
  });
  it('should return the sum of two pages if less than twice max per page', () => {
    const result = calculateNbDetectionsToLoad([
      {
        limit: 10,
        sampling: 1,
        desc: false,
      },
      {
        limit: 7,
        sampling: 1,
        desc: true,
      },
    ]);
    expect(result).toEqual(17);
  });
  it('should return the sum of three pages if less than three times max per page', () => {
    const result = calculateNbDetectionsToLoad([
      {
        limit: 10,
        sampling: 1,
        desc: false,
      },
      {
        offset: 10,
        limit: 7,
        sampling: 1,
        desc: false,
      },
      {
        limit: 10,
        sampling: 1,
        desc: true,
      },
    ]);
    expect(result).toEqual(27);
  });
  it('should count sampling if more than three times max per page', () => {
    const result = calculateNbDetectionsToLoad([
      {
        limit: 10,
        sampling: 1,
        desc: false,
      },
      {
        offset: 10,
        limit: 7,
        sampling: 1,
        desc: false,
      },
      {
        limit: 10,
        sampling: 1,
        desc: true,
      },
    ]);
    expect(result).toEqual(27);
  });
});
