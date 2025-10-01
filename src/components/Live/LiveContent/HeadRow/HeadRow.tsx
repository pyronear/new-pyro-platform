import { Alert, Button } from '@mui/material';

import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { LiveWarningCounter } from './LiveWarningCounter';

interface HeadRowProps {
  onClose: () => void;
  isCounting: boolean;
}

export const HeadRow = ({ onClose, isCounting }: HeadRowProps) => {
  const { t } = useTranslationPrefix('live');
  return (
    <Alert
      severity={isCounting ? 'warning' : 'info'}
      sx={{ margin: 0 }}
      icon={isCounting}
      action={
        <Button variant="outlined" color="primary" onClick={onClose}>
          {t('buttonClose')}
        </Button>
      }
    >
      {isCounting ? <LiveWarningCounter /> : <></>}
    </Alert>
  );
};
