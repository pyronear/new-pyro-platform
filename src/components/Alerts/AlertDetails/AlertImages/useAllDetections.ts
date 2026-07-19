import { useQueries } from '@tanstack/react-query';

import { type DetectionType, getDetectionsPage } from '@/services/alerts';

const DEFAULT_PAGE_SIZE = 100;

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

  const queries = useQueries({
    queries: Array.from({ length: pageCount }, (_, pageIndex) => {
      const offset = pageIndex * pageSize;
      return {
        queryKey: ['detections', sequenceId, offset] as const,
        queryFn: () => getDetectionsPage(sequenceId, offset, pageSize),
        refetchOnWindowFocus: false,
      };
    }),
  });

  const detections = queries.flatMap((q) => q.data ?? []);
  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  return {
    detections,
    isLoading,
    isError,
    loadedCount: detections.length,
    totalCount: detectionsCount,
  };
};
