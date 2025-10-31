import { useEffect, useState } from 'react';

import { formatTimer } from '@/utils/dates';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

export const LiveWarningCounter = () => {
  const { t } = useTranslationPrefix('live.header');
  const [spentTimeInSeconds, setSpentTimeInS] = useState(0);
  useEffect(() => {
    const interval = window.setInterval(
      () => setSpentTimeInS((oldValue) => oldValue + 1),
      1000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <>{t('alertMessage', { timeSpent: formatTimer(spentTimeInSeconds) })}</>
  );
};
