import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { DashboardContainer } from '@/components/Dashboard/DashboardContainer';
import appConfig from '@/services/appConfig';
import { getCameraList } from '@/services/camera';

const CAMERAS_LIST_REFRESH_INTERVAL_MINUTES =
  appConfig.getConfig().CAMERAS_LIST_REFRESH_INTERVAL_MINUTES;

export const DashboardPage = () => {
  const {
    status,
    isFetching,
    data: cameraList,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['cameras'],
    queryFn: getCameraList,
    refetchInterval: CAMERAS_LIST_REFRESH_INTERVAL_MINUTES * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const queryClient = useQueryClient();

  const invalidateAndRefreshData = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ['cameras'] });
  }, [queryClient]);

  return (
    <DashboardContainer
      status={status}
      isRefreshing={isFetching}
      lastUpdate={dataUpdatedAt}
      invalidateAndRefreshData={invalidateAndRefreshData}
      cameraList={cameraList}
    />
  );
};
