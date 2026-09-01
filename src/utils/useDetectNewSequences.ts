import { useEffect, useMemo, useRef } from 'react';

import type { AlertTypeApi } from '@/services/alerts';
import { getLatestAlertStartedAt } from '@/utils/alerts';

export const useDetectNewSequences = (
  alertList: AlertTypeApi[],
  hasFetched: boolean
) => {
  const latestSeenStartedAtRef = useRef<number | null>(null);

  const latestStartedAt = useMemo(
    () => getLatestAlertStartedAt(alertList),
    [alertList]
  );

  const previousLatestStartedAt = latestSeenStartedAtRef.current;
  const hasNewSequence =
    hasFetched &&
    previousLatestStartedAt !== null &&
    latestStartedAt > previousLatestStartedAt;

  useEffect(() => {
    if (!hasFetched) {
      return;
    }
    latestSeenStartedAtRef.current = Math.max(
      latestSeenStartedAtRef.current ?? 0,
      latestStartedAt
    );
  }, [hasFetched, latestStartedAt]);

  return { hasNewSequence };
};
