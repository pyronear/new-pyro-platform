import RefreshIcon from '@mui/icons-material/Refresh';
import { Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { formatUnixToTime } from '../../utils/dates';
import { useTranslationPrefix } from '../../utils/useTranslationPrefix';

interface LastUpdateButtonProps {
  onRefresh: () => void;
  isRefreshing: boolean;
  lastUpdate: number;
}

export const LastUpdateButton = ({
  onRefresh,
  isRefreshing,
  lastUpdate,
}: LastUpdateButtonProps) => {
  const { t } = useTranslationPrefix('common');

  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" onClick={onRefresh} loading={isRefreshing}>
        <RefreshIcon />
      </IconButton>
      <Typography variant="subtitle1">
        {`${t('lastUpdate')} ${formatUnixToTime(lastUpdate)}`}
      </Typography>
    </Stack>
  );
};
