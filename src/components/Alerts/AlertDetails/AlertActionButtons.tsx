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

export type ActionButtonsLayout = 'inline' | 'split';

interface AlertActionButtonsType {
  sequence: SequenceWithCameraInfoType;
  alert: AlertType;
  isLiveMode: boolean;
  invalidateAndRefreshData: () => void;
  layout?: ActionButtonsLayout;
}

export const AlertActionButtons = ({
  sequence,
  alert,
  isLiveMode,
  invalidateAndRefreshData,
  layout = 'split',
}: AlertActionButtonsType) => {
  const { t } = useTranslationPrefix('alerts');
  const [isOcclusionModalOpen, setIsOcclusionModalOpen] = useState(false);

  const lgSizes: Record<ActionButtonsLayout, [number, number, number]> = {
    inline: [4, 4, 4],
    split: [6, 6, 12],
  };
  const [investigateLg, masksLg, treatLg] = lgSizes[layout];

  return (
    <>
      <Grid container spacing={2} direction={{ xs: 'column', lg: 'row' }}>
        {sequence.camera && (
          <Grid size={{ xs: 12, lg: investigateLg }}>
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
        <Grid size={{ xs: 12, lg: masksLg }}>
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
        <Grid size={{ xs: 12, lg: treatLg }}>
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
          ></SequenceLabelContainer>
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
