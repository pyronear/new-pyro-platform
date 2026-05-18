import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

interface RelaunchVideoButtonProps {
  errorMessage: string;
  restartStreaming: () => void;
}

export const RelaunchVideoButton = ({
  errorMessage,
  restartStreaming,
}: RelaunchVideoButtonProps) => {
  const { t } = useTranslationPrefix('live');
  return (
    <Stack spacing={4} alignItems="center">
      <Typography variant="body2">{errorMessage}</Typography>
      <div>
        <Button variant="contained" onClick={restartStreaming}>
          {t('relaunchStreamButton')}
        </Button>
      </div>
    </Stack>
  );
};
