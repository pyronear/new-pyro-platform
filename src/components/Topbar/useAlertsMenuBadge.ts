import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

import {
  getUnlabelledLatestAlerts,
  UNLABELLED_ALERTS_QUERY_KEY,
} from '@/services/alerts';
import appConfig from '@/services/appConfig';

const ALERTS_LIST_REFRESH_INTERVAL_SECONDS =
  appConfig.getConfig().ALERTS_LIST_REFRESH_INTERVAL_SECONDS;

export const useAlertsMenuBadge = (enabled: boolean) => {
  const { pathname } = useLocation();
  const isAlertsPage = pathname === '/alerts';
  const shouldFetchAlerts = enabled && !isAlertsPage;

  const { data: alertList } = useQuery({
    queryKey: UNLABELLED_ALERTS_QUERY_KEY,
    queryFn: getUnlabelledLatestAlerts,
    enabled: shouldFetchAlerts,
    refetchInterval: shouldFetchAlerts
      ? ALERTS_LIST_REFRESH_INTERVAL_SECONDS * 1000
      : false,
  });

  return shouldFetchAlerts ? (alertList?.length ?? 0) : 0;
};
