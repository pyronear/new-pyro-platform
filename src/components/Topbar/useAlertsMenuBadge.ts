import { useQuery } from '@tanstack/react-query';

import {
  getUnlabelledLatestAlerts,
  UNLABELLED_ALERTS_QUERY_KEY,
} from '@/services/alerts';
import { isDateToday } from '@/utils/dates';

export const useAlertsMenuBadge = (enabled: boolean) => {
  const { data: alertList } = useQuery({
    queryKey: UNLABELLED_ALERTS_QUERY_KEY,
    queryFn: getUnlabelledLatestAlerts,
    enabled,
  });

  return (alertList ?? []).filter((alert) => isDateToday(alert.started_at))
    .length;
};
