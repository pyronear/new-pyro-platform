import { useMemo, useRef } from 'react';

import type { SequenceType } from '@/services/alerts';
import { hasNewSequenceSince } from '@/utils/alerts';

export const useDetectNewSequences = (
  sequenceList: SequenceType[] | undefined,
  dataUpdatedAt: number
) => {
  const previousDataUpdatedAtRef = useRef<number>(0);

  const hasNewSequence = useMemo(() => {
    if (!sequenceList || sequenceList.length === 0) {
      previousDataUpdatedAtRef.current = dataUpdatedAt;
      return false;
    }

    const previousDataUpdatedAt = previousDataUpdatedAtRef.current;

    const hasNewSequence = hasNewSequenceSince(
      sequenceList,
      previousDataUpdatedAt
    );

    previousDataUpdatedAtRef.current = dataUpdatedAt;
    return hasNewSequence;
  }, [sequenceList, dataUpdatedAt]);

  return { hasNewSequence };
};
