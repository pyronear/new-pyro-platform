import { useEffect, useState } from 'react';

import { formatTimer } from '@/utils/dates';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

export const LiveWarningCounter = () => {
  const { t } = useTranslationPrefix('live');
  const [spentTimeInSeconds, setSpentTimeInS] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () => setSpentTimeInS((oldValue) => oldValue + 1),
      1000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <>{t('alertMessage', { timeSpent: formatTimer(spentTimeInSeconds) })}</>
  );
};
