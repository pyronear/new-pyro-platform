import PictureInPictureAltIcon from '@mui/icons-material/PictureInPictureAlt';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { Button, Grid } from '@mui/material';
import { useState } from 'react';

import { ModalLiveWrapper } from '@/components/Live/ModalLiveWrapper';
import {
  type AlertType,
  countUnlabelledSequences,
  type SequenceWithCameraInfoType,
} from '@/utils/alerts';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { SequenceLabelContainer } from '../AlertLabel/SequenceLabelContainer';
import { OcclusionMaskModal } from '../OcclusionMaskModal/OcclusionMaskModal';

interface AlertActionButtonsType {
  sequence: SequenceWithCameraInfoType;
  alert: AlertType;
  isLiveMode: boolean;
  invalidateAndRefreshData: () => void;
}

export const AlertActionButtons = ({
  sequence,
  alert,
  isLiveMode,
  invalidateAndRefreshData,
}: AlertActionButtonsType) => {
  const { t } = useTranslationPrefix('alerts');
  const [isOcclusionModalOpen, setIsOcclusionModalOpen] = useState(false);

  return (
    <>
      <Grid container spacing={2} direction={{ xs: 'column', lg: 'row' }}>
        {sequence.camera && (
          <Grid size={{ xs: 12, lg: 6 }}>
            <ModalLiveWrapper cameraName={sequence.camera.name} alert={alert}>
              {(onClick) => (
                <Button
                  color="secondary"
                  variant="outlined"
                  startIcon={<SportsEsportsIcon />}
                  onClick={onClick}
                  fullWidth
                  sx={{ height: '100%' }}
                >
                  {t('buttonInvestigate')}
                </Button>
              )}
            </ModalLiveWrapper>
          </Grid>
        )}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Button
            color="secondary"
            variant="outlined"
            startIcon={<PictureInPictureAltIcon />}
            onClick={() => setIsOcclusionModalOpen(true)}
            fullWidth
            sx={{ height: '100%' }}
          >
            {t('occlusionMask.buttonManageMasks')}
          </Button>
        </Grid>
        <Grid size={12}>
          <SequenceLabelContainer
            sequence={sequence}
            isLiveMode={isLiveMode}
            invalidateAndRefreshData={invalidateAndRefreshData}
            nbSequencesToBeLabelled={countUnlabelledSequences(alert.sequences)}
            renderCustomButton={(onClick) => (
              <Button
                color="secondary"
                variant="contained"
                onClick={onClick}
                fullWidth
                sx={{ height: '100%' }}
              >
                {t(isLiveMode ? 'buttonTreatAlert' : 'buttonModifyAlert')}
              </Button>
            )}
          />
        </Grid>
      </Grid>
      <OcclusionMaskModal
        open={isOcclusionModalOpen}
        onClose={() => setIsOcclusionModalOpen(false)}
        sequence={sequence}
      />
    </>
  );
};
