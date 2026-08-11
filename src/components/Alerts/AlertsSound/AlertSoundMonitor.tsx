import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

import { useAuth } from '@/context/useAuth';
import {
  getUnlabelledLatestAlerts,
  UNLABELLED_ALERTS_QUERY_KEY,
} from '@/services/alerts';
import appConfig from '@/services/appConfig';
import { isDateToday } from '@/utils/dates';
import { useDetectNewSequences as useDetectNewAlerts } from '@/utils/useDetectNewSequences';

import { useAlertSoundToggle } from './useAlertSoundToggle';

const ALERTS_LIST_REFRESH_INTERVAL_SECONDS =
  appConfig.getConfig().ALERTS_LIST_REFRESH_INTERVAL_SECONDS;

export const AlertSoundMonitor = () => {
  const { token } = useAuth();
  const { data: alertList, dataUpdatedAt } = useQuery({
    queryKey: UNLABELLED_ALERTS_QUERY_KEY,
    queryFn: getUnlabelledLatestAlerts,
    enabled: !!token,
    refetchInterval: ALERTS_LIST_REFRESH_INTERVAL_SECONDS * 1000,
    refetchIntervalInBackground: true,
  });
  const todayAlerts = useMemo(
    () => (alertList ?? []).filter((alert) => isDateToday(alert.started_at)),
    [alertList]
  );
  const { hasNewSequence: hasNewAlert } = useDetectNewAlerts(
    todayAlerts,
    dataUpdatedAt
  );
  const { playSound } = useAlertSoundToggle();

  useEffect(() => {
    if (hasNewAlert) {
      playSound();
    }
  }, [hasNewAlert, playSound]);

  return null;
};
