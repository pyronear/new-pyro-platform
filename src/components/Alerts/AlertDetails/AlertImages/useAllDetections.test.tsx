import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as alertsService from '@/services/alerts';

import { useAllDetections } from './useAllDetections';

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

const makeDetection = (id: number): alertsService.DetectionType => ({
  id,
  camera_id: 1,
  pose_id: 1,
  sequence_id: 42,
  bucket_key: `key-${id.toString()}`,
  bbox: '(0.1,0.1,0.2,0.2)',
  others_bboxes: null,
  created_at: `2025-01-01T00:00:${id.toString().padStart(2, '0')}`,
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

describe('useAllDetections', () => {
  beforeEach(() => {
    vi.mocked(alertsService.getDetectionsPage).mockReset();
  });

  it('issues one parallel query per page and concatenates results in order', async () => {
    const page1 = [makeDetection(1), makeDetection(2)];
    const page2 = [makeDetection(3)];
    vi.mocked(alertsService.getDetectionsPage).mockImplementation(
      (_id, offset) => Promise.resolve(offset === 0 ? page1 : page2)
    );

    const { result } = renderHook(
      () =>
        useAllDetections({
          sequenceId: 42,
          detectionsCount: 3,
          pageSize: 2,
        }),
      { wrapper: wrapper(newClient()) }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.detections.map((d) => d.id)).toEqual([1, 2, 3]);
    expect(result.current.totalCount).toBe(3);
    expect(result.current.loadedCount).toBe(3);
    expect(vi.mocked(alertsService.getDetectionsPage)).toHaveBeenCalledTimes(2);
    expect(
      vi.mocked(alertsService.getDetectionsPage).mock.calls.map((c) => c[1])
    ).toEqual(expect.arrayContaining([0, 2]));
  });

  it('returns empty list and not-loading when detectionsCount is 0', async () => {
    const { result } = renderHook(
      () =>
        useAllDetections({
          sequenceId: 42,
          detectionsCount: 0,
          pageSize: 100,
        }),
      { wrapper: wrapper(newClient()) }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.detections).toEqual([]);
    expect(result.current.totalCount).toBe(0);
    expect(vi.mocked(alertsService.getDetectionsPage)).not.toHaveBeenCalled();
  });

  it('exposes partial results while later pages are still loading', async () => {
    const page1 = [makeDetection(1), makeDetection(2)];
    let resolvePage2: (value: alertsService.DetectionType[]) => void = vi.fn();
    const page2Promise = new Promise<alertsService.DetectionType[]>(
      (resolve) => {
        resolvePage2 = resolve;
      }
    );
    vi.mocked(alertsService.getDetectionsPage).mockImplementation(
      (_id, offset) => (offset === 0 ? Promise.resolve(page1) : page2Promise)
    );

    const { result } = renderHook(
      () =>
        useAllDetections({
          sequenceId: 42,
          detectionsCount: 3,
          pageSize: 2,
        }),
      { wrapper: wrapper(newClient()) }
    );

    await waitFor(() => {
      expect(result.current.loadedCount).toBe(2);
    });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.detections.map((d) => d.id)).toEqual([1, 2]);

    resolvePage2([makeDetection(3)]);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.loadedCount).toBe(3);
  });
});
