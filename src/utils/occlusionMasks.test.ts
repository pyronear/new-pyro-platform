import type { OcclusionMaskApiType } from '@/services/occlusionMasks';

import {
  doBboxesOverlap,
  formatBboxToApiMask,
  getNonOverlappingMasks,
  getNonOverlappingMasksWithIds,
  parseApiMask,
  parseBboxes,
} from './occlusionMasks';

describe('parseApiMask', () => {
  it('parses a valid api mask', () => {
    expect(parseApiMask('(0.1,0.2,0.3,0.4)')).toEqual({
      xmin: 0.1,
      ymin: 0.2,
      xmax: 0.3,
      ymax: 0.4,
      confidence: 0,
    });
  });

  it('returns null for malformed api masks', () => {
    expect(parseApiMask('0.1,0.2,0.3,0.4')).toBeNull();
    expect(parseApiMask('(0.1,0.2,abc,0.4)')).toBeNull();
  });
});

describe('formatBboxToApiMask', () => {
  it('rounds values to three decimals', () => {
    expect(
      formatBboxToApiMask({
        xmin: 0.1234,
        ymin: 0.5678,
        xmax: 0.9999,
        ymax: 0.0004,
        confidence: 0.42,
      })
    ).toBe('(0.123,0.568,1,0)');
  });
});

describe('parseBboxes', () => {
  it('parses multiple bbox tuples', () => {
    expect(
      parseBboxes('[(0.1,0.2,0.3,0.4,0.9),(0.5,0.6,0.7,0.8,0.1)]')
    ).toEqual([
      {
        xmin: 0.1,
        ymin: 0.2,
        xmax: 0.3,
        ymax: 0.4,
        confidence: 0.9,
      },
      {
        xmin: 0.5,
        ymin: 0.6,
        xmax: 0.7,
        ymax: 0.8,
        confidence: 0.1,
      },
    ]);
  });

  it('skips invalid bbox tuples', () => {
    const warnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);

    expect(parseBboxes('[(0.1,0.2,0.3,0.4,0.9),(0.5,0.6,0.7)]')).toEqual([
      {
        xmin: 0.1,
        ymin: 0.2,
        xmax: 0.3,
        ymax: 0.4,
        confidence: 0.9,
      },
    ]);

    warnSpy.mockRestore();
  });
});

describe('doBboxesOverlap', () => {
  it('returns true when boxes overlap', () => {
    expect(
      doBboxesOverlap(
        { xmin: 0.1, ymin: 0.1, xmax: 0.4, ymax: 0.4, confidence: 0 },
        { xmin: 0.3, ymin: 0.3, xmax: 0.6, ymax: 0.6, confidence: 0 }
      )
    ).toBe(true);
  });

  it('returns false when boxes only touch edges', () => {
    expect(
      doBboxesOverlap(
        { xmin: 0.1, ymin: 0.1, xmax: 0.4, ymax: 0.4, confidence: 0 },
        { xmin: 0.4, ymin: 0.1, xmax: 0.6, ymax: 0.4, confidence: 0 }
      )
    ).toBe(false);
  });
});

describe('getNonOverlappingMasksWithIds', () => {
  it('keeps the newest overlapping mask, preserves non-overlapping masks, and ignores invalid masks', () => {
    const masks: OcclusionMaskApiType[] = [
      {
        id: 1,
        pose_id: 10,
        mask: '(0.1,0.1,0.4,0.4)',
        created_at: '2025-01-01T10:00:00',
      },
      {
        id: 2,
        pose_id: 10,
        mask: '(0.15,0.15,0.45,0.45)',
        created_at: '2025-01-02T10:00:00',
      },
      {
        id: 3,
        pose_id: 10,
        mask: '(0.6,0.6,0.8,0.8)',
        created_at: '2025-01-03T10:00:00',
      },
      {
        id: 4,
        pose_id: 10,
        mask: 'invalid',
        created_at: '2025-01-04T10:00:00',
      },
    ];

    expect(getNonOverlappingMasksWithIds(masks)).toEqual([
      {
        xmin: 0.6,
        ymin: 0.6,
        xmax: 0.8,
        ymax: 0.8,
        confidence: 0,
        maskId: 3,
      },
      {
        xmin: 0.15,
        ymin: 0.15,
        xmax: 0.45,
        ymax: 0.45,
        confidence: 0,
        maskId: 2,
      },
    ]);
  });
});

describe('getNonOverlappingMasks', () => {
  it('mirrors overlap filtering without ids', () => {
    const masks: OcclusionMaskApiType[] = [
      {
        id: 1,
        pose_id: 10,
        mask: '(0.1,0.1,0.4,0.4)',
        created_at: '2025-01-01T10:00:00',
      },
      {
        id: 2,
        pose_id: 10,
        mask: '(0.15,0.15,0.45,0.45)',
        created_at: '2025-01-02T10:00:00',
      },
      {
        id: 3,
        pose_id: 10,
        mask: '(0.6,0.6,0.8,0.8)',
        created_at: '2025-01-03T10:00:00',
      },
    ];

    expect(getNonOverlappingMasks(masks)).toEqual([
      {
        xmin: 0.6,
        ymin: 0.6,
        xmax: 0.8,
        ymax: 0.8,
        confidence: 0,
      },
      {
        xmin: 0.15,
        ymin: 0.15,
        xmax: 0.45,
        ymax: 0.45,
        confidence: 0,
      },
    ]);
  });
});
