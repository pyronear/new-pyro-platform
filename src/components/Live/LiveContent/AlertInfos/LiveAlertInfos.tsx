import { Box, useTheme } from '@mui/material';

import {
  formatAzimuth,
  formatPosition,
  type SequenceWithCameraInfoType,
} from '@/utils/alerts';
import { formatToDateTime } from '@/utils/dates';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { LiveAlertInfosSection } from './LiveAlertInfosSection';

interface LiveAlertInfosProps {
  sequence: SequenceWithCameraInfoType;
}
export const LiveAlertInfos = ({ sequence }: LiveAlertInfosProps) => {
  const { t } = useTranslationPrefix('alerts');
  const theme = useTheme();
  return (
    <Box
      border={`1px solid ${theme.palette.grey[400]}`}
      p={1.5}
      borderRadius={1}
    >
      <LiveAlertInfosSection title={t('subtitleDate')}>
        {formatToDateTime(sequence.startedAt)}
      </LiveAlertInfosSection>
      <LiveAlertInfosSection title={t('subtitleAzimuth')}>
        {formatAzimuth(sequence.coneAzimuth, 1)}
      </LiveAlertInfosSection>
      <LiveAlertInfosSection title={t('subtitleCameraLocalisation')}>
        {formatPosition(sequence.camera?.lat, sequence.camera?.lon)}
      </LiveAlertInfosSection>
    </Box>
  );
};
