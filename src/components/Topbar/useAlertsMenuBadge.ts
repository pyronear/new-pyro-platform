import { useQuery } from '@tanstack/react-query';

import {
  getUnlabelledLatestAlerts,
  UNLABELLED_ALERTS_QUERY_KEY,
} from '@/services/alerts';
import appConfig from '@/services/appConfig';

const ALERTS_LIST_REFRESH_INTERVAL_SECONDS =
  appConfig.getConfig().ALERTS_LIST_REFRESH_INTERVAL_SECONDS;

export const useAlertsMenuBadge = (enabled: boolean) => {
  const { data: alertList } = useQuery({
    queryKey: UNLABELLED_ALERTS_QUERY_KEY,
    queryFn: getUnlabelledLatestAlerts,
    enabled,
    refetchInterval: enabled
      ? ALERTS_LIST_REFRESH_INTERVAL_SECONDS * 1000
      : false,
  });

  return enabled ? (alertList?.length ?? 0) : 0;
};
