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

  return token ? <AuthenticatedAlertSoundMonitor key={token} /> : null;
};

const AuthenticatedAlertSoundMonitor = () => {
  const {
    data: alertList,
    isFetchedAfterMount,
    isSuccess,
  } = useQuery({
    queryKey: UNLABELLED_ALERTS_QUERY_KEY,
    queryFn: getUnlabelledLatestAlerts,
    refetchInterval: ALERTS_LIST_REFRESH_INTERVAL_SECONDS * 1000,
    refetchIntervalInBackground: true,
  });
  const todayAlerts = useMemo(
    () => (alertList ?? []).filter((alert) => isDateToday(alert.started_at)),
    [alertList]
  );
  // A failed fetch also flips isFetchedAfterMount, so success is checked too:
  // otherwise an erroring first poll would take its baseline from the stale
  // pre-mount data and announce alerts that predate this session.
  const { hasNewSequence: hasNewAlert } = useDetectNewAlerts(
    todayAlerts,
    isSuccess && isFetchedAfterMount
  );
  const { playSound } = useAlertSoundToggle();

  useEffect(() => {
    if (hasNewAlert) {
      playSound();
    }
  }, [hasNewAlert, playSound]);

  return null;
};
