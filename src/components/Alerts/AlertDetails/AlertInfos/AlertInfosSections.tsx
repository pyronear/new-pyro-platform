import { Grid } from '@mui/material';

import {
  type AlertType,
  formatAzimuth,
  formatPosition,
  formatPositionWithoutTronc,
  type SequenceWithCameraInfoType,
} from '@/utils/alerts';
import { formatIsoToDateTime } from '@/utils/dates';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { AlertInfosSection } from './AlertInfosSection';

interface AlertInfosSectionsType {
  sequence: SequenceWithCameraInfoType;
  alert: AlertType;
}

export const AlertInfosSections = ({
  sequence,
  alert,
}: AlertInfosSectionsType) => {
  const { t } = useTranslationPrefix('alerts');

  const itemSize = { xs: 12, sm: 6 };

  return (
    <Grid container spacing={2} direction={{ xs: 'column', lg: 'row' }}>
      <Grid size={itemSize}>
        <AlertInfosSection
          title={t('subtitleDate')}
          withTextToCopy={formatIsoToDateTime(sequence.startedAt)}
        >
          {formatIsoToDateTime(sequence.startedAt)}
        </AlertInfosSection>
      </Grid>
      <Grid size={itemSize}>
        <AlertInfosSection
          title={t('subtitleAzimuth')}
          withTextToCopy={sequence.azimuth.toString()}
        >
          {formatAzimuth(sequence.azimuth, 1)}
        </AlertInfosSection>
      </Grid>
      <Grid size={itemSize}>
        <AlertInfosSection
          title={t('subtitleCameraLocalisation')}
          withTextToCopy={formatPositionWithoutTronc(
            sequence.camera?.lat,
            sequence.camera?.lon
          )}
        >
          {formatPosition(sequence.camera?.lat, sequence.camera?.lon)}
        </AlertInfosSection>
      </Grid>
      {alert.eventSmokeLocation && (
        <Grid size={itemSize}>
          <AlertInfosSection
            title={t('subtitleSmokeLocalisation')}
            withTextToCopy={formatPositionWithoutTronc(
              ...alert.eventSmokeLocation
            )}
          >
            {formatPosition(...alert.eventSmokeLocation)}
          </AlertInfosSection>
        </Grid>
      )}
    </Grid>
  );
};
