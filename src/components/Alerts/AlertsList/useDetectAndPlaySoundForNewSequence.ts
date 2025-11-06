import { useCallback, useEffect, useRef } from 'react';

import type { SequenceType } from '../../../services/alerts';
import { convertStrToEpoch } from '../../../utils/dates';
import { useAlertSoundToggle } from './useAlertSoundToggle';

export const useDetectAndPlaySoundForNewSequence = (
  sequenceList: SequenceType[] | undefined,
  dataUpdatedAt: number
) => {
  const { isAlertSoundOn, toggleSound, playSound } =
    useAlertSoundToggle('/sounds/fire.mp3');

  const previousDataUpdatedAtRef = useRef<number>(0);

  const detectAndPlaySoundForNewSequences = useCallback(() => {
    if (!sequenceList || sequenceList.length === 0) {
      previousDataUpdatedAtRef.current = dataUpdatedAt;
      return;
    }

    const previousDataUpdatedAt = previousDataUpdatedAtRef.current;

    const hasNewSequence = sequenceList.some((sequence) => {
      if (!sequence.started_at) {
        return false;
      }
      const sequenceCreationTime =
        convertStrToEpoch(sequence.started_at) * 1000;
      return sequenceCreationTime >= previousDataUpdatedAt;
    });

    if (hasNewSequence) {
      playSound();
    }

    previousDataUpdatedAtRef.current = dataUpdatedAt;
  }, [sequenceList, dataUpdatedAt, playSound]);

  useEffect(() => {
    detectAndPlaySoundForNewSequences();
  }, [detectAndPlaySoundForNewSequences]);

  return { isAlertSoundOn, onSoundToggle: toggleSound };
};
