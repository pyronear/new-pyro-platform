import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { DashboardContainer } from '../components/Dashboard/DashboardContainer';
import { getCameraList } from '../services/camera';

const VITE_CAMERAS_LIST_REFRESH_INTERVAL_MINUTES = Number(
  import.meta.env.VITE_CAMERAS_LIST_REFRESH_INTERVAL_MINUTES
);

export const DashboardPage = () => {
  const {
    status,
    isFetching,
    data: cameraList,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['cameras'],
    queryFn: getCameraList,
    refetchInterval: VITE_CAMERAS_LIST_REFRESH_INTERVAL_MINUTES * 60 * 1000,
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
