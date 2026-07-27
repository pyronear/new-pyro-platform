import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Stack, Typography } from '@mui/material';
import { type Dispatch, type SetStateAction } from 'react';

import smallLogo from '@/assets/small-logo.png';
import {
  type AlertType,
  countUnlabelledSequences,
  type SequenceWithCameraInfoType,
} from '@/utils/alerts';
import { useIsMobile } from '@/utils/useIsMobile';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { SequenceLabelContainer } from '../AlertLabel/SequenceLabelContainer';
import { AlertSequenceControls } from './AlertSequenceControls';

interface AlertHeaderType {
  isLiveMode: boolean;
  invalidateAndRefreshData: () => void;
  alert: AlertType;
  selectedSequence: SequenceWithCameraInfoType;
  setSelectedSequence: Dispatch<
    SetStateAction<SequenceWithCameraInfoType | null>
  >;
  resetAlert: () => void;
}

export const AlertHeader = ({
  isLiveMode,
  invalidateAndRefreshData,
  alert,
  selectedSequence,
  setSelectedSequence,
  resetAlert,
}: AlertHeaderType) => {
  const isMobile = useIsMobile();
  const { t } = useTranslationPrefix('alerts');

  const camera = selectedSequence.camera;

  return (
    <>
      {isMobile ? (
        <Stack spacing={1}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="wrap"
          >
            <IconButton
              aria-label={t('titleButtonBackAlt')}
              onClick={resetAlert}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h1">
              {camera?.name ?? t('defaultCameraName')}
            </Typography>
            <SequenceLabelContainer
              sequence={selectedSequence}
              isLiveMode={isLiveMode}
              invalidateAndRefreshData={invalidateAndRefreshData}
              nbSequencesToBeLabelled={countUnlabelledSequences(
                alert.sequences
              )}
            />
          </Stack>
          <div style={{ alignSelf: 'center' }}>
            <AlertSequenceControls
              alert={alert}
              selectedSequence={selectedSequence}
              setSelectedSequence={setSelectedSequence}
              invalidateAndRefreshData={invalidateAndRefreshData}
            />
          </div>
        </Stack>
      ) : (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <img src={smallLogo} height="26px" width="26px" />
            <Typography variant="h1">
              {camera?.name ?? t('defaultCameraName')}
            </Typography>
            <SequenceLabelContainer
              sequence={selectedSequence}
              isLiveMode={isLiveMode}
              invalidateAndRefreshData={invalidateAndRefreshData}
              nbSequencesToBeLabelled={countUnlabelledSequences(
                alert.sequences
              )}
            />
          </Stack>
          <AlertSequenceControls
            alert={alert}
            selectedSequence={selectedSequence}
            setSelectedSequence={setSelectedSequence}
            invalidateAndRefreshData={invalidateAndRefreshData}
          />
        </Stack>
      )}
    </>
  );
};
