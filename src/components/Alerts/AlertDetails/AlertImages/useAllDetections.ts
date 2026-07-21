import {
  type InfiniteData,
  type QueryKey,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { useEffect } from 'react';

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
  loadedCount: number;
  totalCount: number;
}

export const useAllDetections = ({
  sequenceId,
  detectionsCount,
  pageSize = DEFAULT_PAGE_SIZE,
}: UseAllDetectionsParams): UseAllDetectionsResult => {
  const pageCount = Math.ceil(detectionsCount / pageSize);

  console.log(pageCount);
  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
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
      maxPages: pageCount,
      refetchOnWindowFocus: false,
      queryFn: ({ pageParam }) =>
        getDetectionsPage(sequenceId, pageParam * pageSize, pageSize),
    });

  useEffect(() => {
    if (hasNextPage && !isLoading) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isLoading]);

  const detections: DetectionType[] = data?.pages.flatMap((q) => q) ?? [];

  return {
    detections,
    isLoading,
    isError,
    loadedCount: detections.length,
    totalCount: detectionsCount,
  };
};
