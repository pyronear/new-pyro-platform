import Alert from '@mui/material/Alert';

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
  return (
    <Alert severity="error" sx={{ m: 0, textAlign: 'left' }} icon={false}>
      <LiveAlertInfosSection title={t('subtitleDate')}>
        {formatToDateTime(sequence.startedAt)}
      </LiveAlertInfosSection>
      <LiveAlertInfosSection title={t('subtitleAzimuth')}>
        {formatAzimuth(sequence.coneAzimuth, 1)}
      </LiveAlertInfosSection>
      <LiveAlertInfosSection title={t('subtitleLocalisation')}>
        {formatPosition(sequence.camera?.lat, sequence.camera?.lon)}
      </LiveAlertInfosSection>
    </Alert>
  );
};
