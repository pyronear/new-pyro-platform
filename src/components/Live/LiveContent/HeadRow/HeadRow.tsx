import { Alert, Button } from '@mui/material';

import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { LiveWarningCounter } from './LiveWarningCounter';

interface HeadRowProps {
  onClose: () => void;
  isStreamingLaunched: boolean;
  isStreamingInterrupted: boolean;
}

export const HeadRow = ({
  onClose,
  isStreamingLaunched,
  isStreamingInterrupted,
}: HeadRowProps) => {
  const { t } = useTranslationPrefix('live.header');
  return (
    <Alert
      severity={isStreamingLaunched ? 'warning' : 'info'}
      sx={{ margin: 0, display: 'flex', alignItems: 'center' }}
      action={
        <Button variant="outlined" color="primary" onClick={onClose}>
          {t('buttonClose')}
        </Button>
      }
    >
      {!isStreamingInterrupted && !isStreamingLaunched && (
        <>{t('loadingMessage')}</>
      )}
      {isStreamingInterrupted && <>{t('interruptedMessage')}</>}
      {isStreamingLaunched && <LiveWarningCounter />}
    </Alert>
  );
};
