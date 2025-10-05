import PictureInPictureAltIcon from '@mui/icons-material/PictureInPictureAlt';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { Button, Divider, Grid, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';

import { ModalLiveWrapper } from '@/components/Live/ModalLiveWrapper';
import {
  type AlertType,
  countUnlabelledSequences,
  formatAzimuth,
  formatPosition,
  type SequenceWithCameraInfoType,
} from '@/utils/alerts';
import { formatToDateTime } from '@/utils/dates';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { SequenceLabelContainer } from '../../AlertLabel/SequenceLabelContainer';
import { OcclusionMaskModal } from '../../OcclusionMaskModal/OcclusionMaskModal';
import { AlertInfosSection } from './AlertInfosSection';
import AlertMap from './AlertMap';

interface AlertInfosType {
  isLiveMode: boolean;
  invalidateAndRefreshData: () => void;
  sequence: SequenceWithCameraInfoType;
  alert: AlertType;
}

export const AlertInfos = ({
  isLiveMode,
  invalidateAndRefreshData,
  sequence,
  alert,
}: AlertInfosType) => {
  const theme = useTheme();
  const { t } = useTranslationPrefix('alerts');
  const [isOcclusionModalOpen, setIsOcclusionModalOpen] = useState(false);

  return (
    <Paper
      sx={{
        height: '100%',
        borderRadius: 6,
        padding: 2,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      }}
    >
      <Grid container direction="column" spacing={2} height="100%">
        <Grid minHeight={35} container alignItems="center">
          <Typography variant="h2">{t('titleDetails')}</Typography>
        </Grid>

        <Divider
          flexItem
          sx={{ borderColor: theme.palette.primary.contrastText }}
        />
        <Grid
          container
          direction="column"
          justifyContent="space-between"
          flexGrow={1}
        >
          <Grid container spacing={2} direction="column">
            <AlertInfosSection title={t('subtitleDate')}>
              {formatToDateTime(sequence.startedAt)}
            </AlertInfosSection>
            <AlertInfosSection title={t('subtitleAzimuth')}>
              {formatAzimuth(sequence.coneAzimuth, 1)}
            </AlertInfosSection>
            <AlertInfosSection title={t('subtitleCameraLocalisation')}>
              {formatPosition(sequence.camera?.lat, sequence.camera?.lon)}
            </AlertInfosSection>
            {alert.eventSmokeLocation && (
              <AlertInfosSection title={t('subtitleSmokeLocalisation')}>
                {formatPosition(...alert.eventSmokeLocation)}
              </AlertInfosSection>
            )}
          </Grid>
          <Grid container flexGrow={1} minHeight={200}>
            <AlertMap alert={alert} />
          </Grid>
          <Grid container spacing={2} direction="column">
            {isLiveMode && sequence.camera && (
              <ModalLiveWrapper
                cameraName={sequence.camera.name}
                sequence={sequence}
              >
                {(onClick) => (
                  <Button
                    color="secondary"
                    variant="outlined"
                    startIcon={<SportsEsportsIcon />}
                    onClick={onClick}
                  >
                    {t('buttonInvestigate')}
                  </Button>
                )}
              </ModalLiveWrapper>
            )}
            <Button
              color="secondary"
              variant="outlined"
              startIcon={<PictureInPictureAltIcon />}
              onClick={() => setIsOcclusionModalOpen(true)}
            >
              {t('occlusionMask.buttonManageMasks')}
            </Button>
            <SequenceLabelContainer
              sequence={sequence}
              isLiveMode={isLiveMode}
              invalidateAndRefreshData={invalidateAndRefreshData}
              nbSequencesToBeLabelled={countUnlabelledSequences(
                alert.sequences
              )}
              renderCustomButton={(onClick) => (
                <Button color="secondary" variant="contained" onClick={onClick}>
                  {t(isLiveMode ? 'buttonTreatAlert' : 'buttonModifyAlert')}
                </Button>
              )}
            ></SequenceLabelContainer>
          </Grid>
        </Grid>
      </Grid>
      <OcclusionMaskModal
        open={isOcclusionModalOpen}
        onClose={() => setIsOcclusionModalOpen(false)}
        sequence={sequence}
      />
    </Paper>
  );
};
