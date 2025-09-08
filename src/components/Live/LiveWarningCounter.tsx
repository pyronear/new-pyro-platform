import { Alert, Button } from '@mui/material';
import { useEffect, useState } from 'react';

import { formatTimer } from '@/utils/dates';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

interface LiveWarningCounterProps {
  onClose: () => void;
}

export const LiveWarningCounter = ({ onClose }: LiveWarningCounterProps) => {
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
    <Alert
      severity="warning"
      sx={{ margin: 0 }}
      action={
        <Button variant="outlined" color="primary" onClick={onClose}>
          {t('buttonClose')}
        </Button>
      }
    >
      {t('alertMessage', { timeSpent: formatTimer(spentTimeInSeconds) })}
    </Alert>
  );
};
