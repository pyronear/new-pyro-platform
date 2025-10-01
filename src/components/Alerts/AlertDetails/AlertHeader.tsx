import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton, Stack, Typography } from '@mui/material';
import type { Dispatch, SetStateAction } from 'react';

import smallLogo from '@/assets/small-logo.png';
import {
  countUnlabelledSequences,
  type SequenceWithCameraInfoType,
} from '@/utils/alerts';
import { useIsMobile } from '@/utils/useIsMobile';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { SequenceLabelContainer } from '../AlertLabel/SequenceLabelContainer';
import { SequenceSelector } from './SequenceSelector';

interface AlertHeaderType {
  isLiveMode: boolean;
  invalidateAndRefreshData: () => void;
  sequences: SequenceWithCameraInfoType[];
  selectedSequence: SequenceWithCameraInfoType;
  setSelectedSequence: Dispatch<
    SetStateAction<SequenceWithCameraInfoType | null>
  >;
  resetAlert: () => void;
}

export const AlertHeader = ({
  isLiveMode,
  invalidateAndRefreshData,
  sequences,
  selectedSequence,
  setSelectedSequence,
  resetAlert,
}: AlertHeaderType) => {
  const isMobile = useIsMobile();
  const { t } = useTranslationPrefix('alerts');

  const camera = selectedSequence.camera;

  const Title = (
    <Typography variant="h1">
      {camera?.name ?? t('defaultCameraName')}
    </Typography>
  );

  const SequenceLabel = (
    <SequenceLabelContainer
      sequence={selectedSequence}
      isLiveMode={isLiveMode}
      invalidateAndRefreshData={invalidateAndRefreshData}
      nbSequencesToBeLabelled={countUnlabelledSequences(sequences)}
    />
  );

  const SequenceSelectorComponent = sequences.length > 1 && (
    <SequenceSelector
      sequences={sequences}
      setSelectedSequence={setSelectedSequence}
      selectedSequence={selectedSequence}
    />
  );

  return (
    <>
      {isMobile ? (
        <Stack spacing={1}>
          <Stack direction="row" spacing={1} justifyContent="space-between">
            <IconButton
              aria-label={t('titleButtonBackAlt')}
              onClick={resetAlert}
            >
              <ArrowBackIcon />
            </IconButton>
            {SequenceSelectorComponent}
          </Stack>

          <Stack direction="row" flexWrap="wrap" spacing={2}>
            {Title}
            {SequenceLabel}
          </Stack>
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
            {Title}
            {SequenceLabel}
          </Stack>
          {SequenceSelectorComponent}
        </Stack>
      )}
    </>
  );
};
