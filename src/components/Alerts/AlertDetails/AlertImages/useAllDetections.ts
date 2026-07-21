import {
  type InfiniteData,
  type QueryKey,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';

import { type DetectionType, getDetectionsPage } from '@/services/alerts';
import appConfig from '@/services/appConfig.ts';

const DEFAULT_PAGE_SIZE = appConfig.getConfig().ALERTS_PLAYER_BUFFER_SIZE;

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

export const useAllDetections = ({
  sequenceId,
  detectionsCount,
  pageSize = DEFAULT_PAGE_SIZE,
}: UseAllDetectionsParams): UseAllDetectionsResult => {
  const queryClient = useQueryClient();
  const pageCount = Math.ceil(detectionsCount / pageSize);

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
        return lastPageParam < pageCount - 1 ? lastPageParam + 1 : undefined;
      },
      queryKey: ['detections', sequenceId] as const,
      initialPageParam: 0,
      enabled: !pageCount,
      refetchOnWindowFocus: false,
      queryFn: ({ pageParam }) =>
        getDetectionsPage(sequenceId, pageParam * pageSize, pageSize),
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
    totalCount: detectionsCount,
    invalidateAndRefreshData,
  };
};
