import { useMemo, useRef } from 'react';

import type { AlertTypeApi } from '@/services/alerts';
import { hasNewAlertSince } from '@/utils/alerts';

export const useDetectNewSequences = (
  alertList: AlertTypeApi[],
  dataUpdatedAt: number
) => {
  const previousDataUpdatedAtRef = useRef<number>(0);

  const hasNewSequence = useMemo(() => {
    if (alertList.length === 0) {
      previousDataUpdatedAtRef.current = dataUpdatedAt;
      return false;
    }

    const previousDataUpdatedAt = previousDataUpdatedAtRef.current;

    const hasNewSequence = hasNewAlertSince(alertList, previousDataUpdatedAt);

    previousDataUpdatedAtRef.current = dataUpdatedAt;
    return hasNewSequence;
  }, [alertList, dataUpdatedAt]);

  return { hasNewSequence };
};
