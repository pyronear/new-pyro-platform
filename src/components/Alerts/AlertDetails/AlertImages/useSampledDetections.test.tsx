import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { DetectionType } from '@/services/alerts';
import * as alertsService from '@/services/alerts';

import { useSampledDetections } from './useSampledDetections.ts';

vi.mock('@/services/alerts', async () => {
  const actual =
    await vi.importActual<typeof import('@/services/alerts')>(
      '@/services/alerts'
    );
  return {
    ...actual,
    getDetectionsPage: vi.fn(),
  };
});

const makeDetection = (
  id: number,
  recordedAt?: string
): alertsService.DetectionType => ({
  id,
  camera_id: 1,
  pose_id: 1,
  sequence_id: 42,
  bucket_key: `key-${id.toString()}`,
  bbox: '(0.1,0.1,0.2,0.2)',
  others_bboxes: null,
  created_at: `2025-01-01T00:00:${id.toString().padStart(2, '0')}`,
  recorded_at:
    recordedAt ?? `2025-01-01T00:00:${id.toString().padStart(2, '0')}`,
  url: `https://example/${id.toString()}`,
});

const wrapper = (client: QueryClient) => {
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

const newClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

describe('useSampledDetections', () => {
  beforeEach(() => {
    vi.mocked(alertsService.getDetectionsPage).mockReset();
  });

  it('issues one sequential query per page and concatenates results in order', async () => {
    const page1: DetectionType[] = [makeDetection(1), makeDetection(2)];
    const page2: DetectionType[] = [makeDetection(3)];
    vi.mocked(alertsService.getDetectionsPage)
      .mockResolvedValueOnce(page1)
      .mockResolvedValueOnce(page2);

    const { result } = renderHook(
      () =>
        useSampledDetections({
          sequenceId: 42,
          detectionsCount: 3,
        }),
      { wrapper: wrapper(newClient()) }
    );

    await waitFor(() => {
      expect(result.current.hasNextPage).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.detections.map((d) => d.id)).toEqual([1, 2, 3]);
    expect(result.current.totalCount).toBe(3);
    expect(result.current.loadedCount).toBe(3);
    expect(vi.mocked(alertsService.getDetectionsPage)).toHaveBeenCalledTimes(2);
  });

  it('orders detections by capture time, not by database creation time', async () => {
    // created_at ascending by id, recorded_at deliberately reversed
    vi.mocked(alertsService.getDetectionsPage).mockResolvedValueOnce([
      makeDetection(1, '2025-01-01T00:00:20'),
      makeDetection(2, '2025-01-01T00:00:05'),
    ]);

    const { result } = renderHook(
      () =>
        useSampledDetections({
          sequenceId: 42,
          detectionsCount: 2,
        }),
      { wrapper: wrapper(newClient()) }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.detections.map((d) => d.id)).toEqual([2, 1]);
  });

  it('returns empty list and not-loading when detectionsCount is 0', async () => {
    const { result } = renderHook(
      () =>
        useSampledDetections({
          sequenceId: 42,
          detectionsCount: 0,
        }),
      { wrapper: wrapper(newClient()) }
    );

    await waitFor(() => {
      expect(result.current.hasNextPage).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.detections).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(vi.mocked(alertsService.getDetectionsPage)).not.toHaveBeenCalled();
  });
});
