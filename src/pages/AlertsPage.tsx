import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback, useEffect, useMemo } from 'react';

import { AlertsContainer } from '@/components/Alerts/AlertsContainer';
import { CameraListProvider } from '@/context/CameraListProvider';
import { getUnlabelledLatestAlerts } from '@/services/alerts';
import appConfig from '@/services/appConfig';
import { STATUS_ERROR, STATUS_LOADING, STATUS_SUCCESS } from '@/services/axios';
import { getCameraList } from '@/services/camera';
import { type AlertType, mapListAlertApiToAlertType } from '@/utils/alerts';
import { isDateToday } from '@/utils/dates';
import { useDetectNewSequences as useDetectNewAlerts } from '@/utils/useDetectNewSequences';

const ALERTS_LIST_REFRESH_INTERVAL_SECONDS =
  appConfig.getConfig().ALERTS_LIST_REFRESH_INTERVAL_SECONDS;
const UNLABELLED_ALERTS_PAGE_SIZE = 100;

export const AlertsPage = () => {
  const queryClient = useQueryClient();
  const {
    isFetching,
    dataUpdatedAt,
    status: statusSequences,
    data: alertPages,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['unlabelledAlerts'],
    queryFn: async ({ pageParam }) =>
      await getUnlabelledLatestAlerts(
        UNLABELLED_ALERTS_PAGE_SIZE,
        pageParam * UNLABELLED_ALERTS_PAGE_SIZE
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length === UNLABELLED_ALERTS_PAGE_SIZE
        ? lastPageParam + 1
        : undefined,
    refetchInterval: ALERTS_LIST_REFRESH_INTERVAL_SECONDS * 1000,
  });

  const { status: statusCameras, data: cameraList } = useQuery({
    queryKey: ['cameras'],
    queryFn: getCameraList,
  });

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const alertList = useMemo(() => alertPages?.pages.flat() ?? [], [alertPages]);

  const todayAlerts = useMemo(
    () => alertList.filter((alert) => isDateToday(alert.started_at)),
    [alertList]
  );

  const alertsList: AlertType[] = useMemo(
    () => mapListAlertApiToAlertType(todayAlerts, cameraList ?? []),
    [todayAlerts, cameraList]
  );

  const { hasNewSequence: hasNewAlert } = useDetectNewAlerts(
    todayAlerts,
    dataUpdatedAt
  );

  const invalidateAndRefreshData = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['unlabelledAlerts'] });
  }, [queryClient]);

  const status = useMemo(() => {
    if (statusSequences == STATUS_SUCCESS && statusCameras == STATUS_SUCCESS) {
      return STATUS_SUCCESS;
    }
    if (statusSequences == STATUS_LOADING || statusCameras == STATUS_LOADING) {
      return STATUS_LOADING;
    }
    return STATUS_ERROR;
  }, [statusSequences, statusCameras]);

  return (
    <CameraListProvider camerasList={cameraList ?? []}>
      <AlertsContainer
        status={status}
        isRefreshing={isFetching}
        lastUpdate={dataUpdatedAt}
        invalidateAndRefreshData={invalidateAndRefreshData}
        alertsList={alertsList}
        hasNewSequence={hasNewAlert}
      />
    </CameraListProvider>
  );
};
