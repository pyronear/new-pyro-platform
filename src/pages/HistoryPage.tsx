import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import { getSequencesByFilters } from '@/services/alerts';
import appConfig from '@/services/appConfig';
import { STATUS_ERROR, STATUS_LOADING, STATUS_SUCCESS } from '@/services/axios';
import { getCameraList } from '@/services/camera';
import { type AlertType, convertSequencesToAlerts } from '@/utils/alerts';
import { formatDateToApi } from '@/utils/dates';
import {
  type FiltersType,
  INITIAL_FILTERS,
  isFiltersEmpty,
} from '@/utils/history';

import { HistoryContainer } from '../components/History/HistoryContainer';

const HISTORY_NB_ALERTS_PER_PAGE =
  appConfig.getConfig().HISTORY_NB_ALERTS_PER_PAGE;

export const HistoryPage = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<FiltersType>(INITIAL_FILTERS);
  const isQuerySequencesEnabled = useMemo(
    () => !isFiltersEmpty(filters),
    [filters]
  );
  const {
    status: statusSequences,
    data: sequenceList,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    enabled: isQuerySequencesEnabled,
    queryKey: ['sequenceList', filters],
    queryFn: async ({ pageParam }) => {
      return await getSequencesByFilters(
        filters.date ? formatDateToApi(filters.date) : '',
        HISTORY_NB_ALERTS_PER_PAGE,
        pageParam * HISTORY_NB_ALERTS_PER_PAGE
      );
    },
    refetchOnWindowFocus: false,
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });

  const { status: statusCameras, data: cameraList } = useQuery({
    queryKey: ['cameras'],
    queryFn: getCameraList,
    refetchOnWindowFocus: false,
  });

  const invalidateAndRefreshData = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['sequenceList'] });
  }, [queryClient]);

  const alertsList: AlertType[] = useMemo(() => {
    return convertSequencesToAlerts(
      sequenceList?.pages.flat() ?? [],
      cameraList ?? []
    );
  }, [sequenceList, cameraList]);

  const status = useMemo(() => {
    if (
      (statusSequences == STATUS_SUCCESS || !isQuerySequencesEnabled) &&
      statusCameras == STATUS_SUCCESS
    ) {
      return STATUS_SUCCESS;
    }
    if (
      (isQuerySequencesEnabled && statusSequences == STATUS_LOADING) ||
      statusCameras == STATUS_LOADING
    ) {
      return STATUS_LOADING;
    }
    return STATUS_ERROR;
  }, [statusSequences, statusCameras, isQuerySequencesEnabled]);

  return (
    <HistoryContainer
      isQuerySequencesEnabled={isQuerySequencesEnabled}
      filters={filters}
      setFilters={setFilters}
      status={status}
      alertsList={alertsList}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={() => void fetchNextPage()}
      invalidateAndRefreshData={invalidateAndRefreshData}
    />
  );
};
