import type { DetectionType } from '@/services/alerts';
import {
  calculateDetectionsPages,
  calculateNbDetectionsToLoad,
  parseMainDetectionBox,
  parseOtherDetectionBoxes,
} from '@/utils/detections.ts';

const makeDetection = (
  overrides: Partial<DetectionType> = {}
): DetectionType => ({
  id: 1,
  camera_id: 1,
  pose_id: 1,
  sequence_id: 42,
  bucket_key: 'key-1',
  bbox: '(0.1,0.2,0.3,0.4,0.9)',
  others_bboxes: null,
  created_at: '2025-01-01T00:00:00',
  recorded_at: '2025-01-01T00:00:00',
  url: 'https://example/1',
  ...overrides,
});

describe('parseMainDetectionBox', () => {
  it('returns null when detection is null', () => {
    expect(parseMainDetectionBox(null)).toBeNull();
  });

  it('returns null when bbox is malformed', () => {
    expect(parseMainDetectionBox(makeDetection({ bbox: 'nope' }))).toBeNull();
  });

  it('converts bbox coords to percentages', () => {
    expect(
      parseMainDetectionBox(makeDetection({ bbox: '(0.1,0.2,0.3,0.4,0.9)' }))
    ).toEqual({
      left: '10%',
      top: '20%',
      width: '20%',
      height: '20%',
    });
  });
});

describe('parseOtherDetectionBoxes', () => {
  it('returns null when detection is null', () => {
    expect(parseOtherDetectionBoxes(null)).toBeNull();
  });

  it('returns null when others_bboxes is null', () => {
    expect(
      parseOtherDetectionBoxes(makeDetection({ others_bboxes: null }))
    ).toBeNull();
  });

  it('converts every other bbox to percentages', () => {
    expect(
      parseOtherDetectionBoxes(
        makeDetection({
          others_bboxes: '[(0.1,0.1,0.2,0.2,0.9),(0.5,0.5,0.75,0.65,0.4)]',
        })
      )
    ).toEqual([
      { left: '10%', top: '10%', width: '10%', height: '10%' },
      { left: '50%', top: '50%', width: '25%', height: '15%' },
    ]);
  });

  it('returns an empty array when others_bboxes has no tuples', () => {
    expect(
      parseOtherDetectionBoxes(makeDetection({ others_bboxes: '[]' }))
    ).toEqual([]);
  });
});

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
