import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Stack, Typography } from '@mui/material';

import type { AlertType } from '../../../utils/alerts';
import { formatTimeAgo } from '../../../utils/dates';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';
import { useRefreshEvery } from './useRefreshEvery';

export const AlertStartedTimeAgo = ({ alert }: { alert: AlertType }) => {
  const { t: alertsTimeTranslation } = useTranslationPrefix('alerts.time');
  const formattedTimeAgo = formatTimeAgo({
    pastDateString: alert.startedAt,
    translationFunction: alertsTimeTranslation,
  });

  useRefreshEvery(60); // re-render every 60s

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <HourglassEmptyIcon fontSize="inherit" color="disabled" />
      <Typography variant="subtitle2">{formattedTimeAgo}</Typography>
    </Stack>
  );
};
