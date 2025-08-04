import { useQuery } from '@tanstack/react-query';

import { DashboardContainer } from '../components/Dashboard/DashboardContainer';
import { getCameraList } from '../services/camera';

const VITE_CAMERAS_LIST_REFRESH_INTERVAL_MINUTES = Number(
  import.meta.env.VITE_CAMERAS_LIST_REFRESH_INTERVAL_MINUTES
);

export const DashboardPage = () => {
  const {
    isPending,
    isError,
    data: cameraList,
    isSuccess,
  } = useQuery({
    queryKey: ['cameras'],
    queryFn: getCameraList,
    refetchInterval: VITE_CAMERAS_LIST_REFRESH_INTERVAL_MINUTES * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  return (
    <DashboardContainer
      isError={isError}
      isPending={isPending}
      isSuccess={isSuccess}
      cameraList={cameraList}
    />
  );
};
