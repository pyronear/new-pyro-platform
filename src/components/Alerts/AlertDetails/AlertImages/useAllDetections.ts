import {
  type InfiniteData,
  type QueryKey,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';

import { type DetectionType, getDetectionsPage } from '@/services/alerts';
import {
  calculateDetectionsPages,
  calculateNbDetectionsToLoad,
} from '@/utils/detections.ts';

interface UseAllDetectionsParams {
  sequenceId: number;
  detectionsCount: number;
  pageSize?: number;
}

interface UseAllDetectionsResult {
  detections: DetectionType[];
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  loadedCount: number;
  totalCount: number;
  invalidateAndRefreshData: () => void;
}

/**
 * Hook to retrieve at most {DEFAULT_PAGE_SIZE * MAX_PAGE_COUNT} detections
 * - the first {DEFAULT_PAGE_SIZE} detections
 * - the last {DEFAULT_PAGE_SIZE} detections
 * - one middle page : using sampling if there is more than {DEFAULT_PAGE_SIZE} detections
 */
export const useAllDetections = ({
  sequenceId,
  detectionsCount,
}: UseAllDetectionsParams): UseAllDetectionsResult => {
  const queryClient = useQueryClient();
  const pages = useMemo(
    () => calculateDetectionsPages(detectionsCount),
    [detectionsCount]
  );

  const invalidateAndRefreshData = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: ['detections', sequenceId],
    });
  }, [queryClient, sequenceId]);

  const { data, isLoading, isFetching, isError, fetchNextPage, hasNextPage } =
    useInfiniteQuery<
      DetectionType[],
      Error,
      InfiniteData<DetectionType[]>,
      QueryKey,
      number
    >({
      getNextPageParam: (
        _lastPage: unknown,
        _allPages: unknown,
        lastPageParam: number
      ) => {
        return lastPageParam < pages.length - 1 ? lastPageParam + 1 : undefined;
      },
      queryKey: ['detections', sequenceId] as const,
      initialPageParam: 0,
      enabled: !!pages.length,
      refetchOnWindowFocus: false,
      queryFn: ({ pageParam }) => {
        const page = pages[pageParam];
        return getDetectionsPage(
          sequenceId,
          page.offset,
          page.limit,
          page.sampling
        );
      },
    });

  useEffect(() => {
    if (hasNextPage && !isFetching && !isError) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isError, isFetching, isLoading]);

  const detections: DetectionType[] = data?.pages.flat() ?? [];

  return {
    detections,
    isLoading,
    hasNextPage,
    isError,
    loadedCount: detections.length,
    totalCount: calculateNbDetectionsToLoad(pages),
    invalidateAndRefreshData,
  };
};
