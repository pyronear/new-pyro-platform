import { Stack } from '@mui/material';
import { type Dispatch, type SetStateAction } from 'react';

import {
  type AlertType,
  type SequenceWithCameraInfoType,
} from '@/utils/alerts';

import { SequenceSelector } from './SequenceSelector';
import { SequenceUnmatchContainer } from './SequenceUnmatchContainer';

interface AlertSequenceControlsProps {
  alert: AlertType;
  selectedSequence: SequenceWithCameraInfoType;
  setSelectedSequence: Dispatch<
    SetStateAction<SequenceWithCameraInfoType | null>
  >;
  invalidateAndRefreshData: () => void;
}

export const AlertSequenceControls = ({
  alert,
  selectedSequence,
  setSelectedSequence,
  invalidateAndRefreshData,
}: AlertSequenceControlsProps) => {
  if (alert.sequences.length <= 1) {
    return null;
  }

  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
      <SequenceSelector
        alert={alert}
        setSelectedSequence={setSelectedSequence}
        selectedSequence={selectedSequence}
      />
      <SequenceUnmatchContainer
        alert={alert}
        sequence={selectedSequence}
        invalidateAndRefreshData={invalidateAndRefreshData}
      />
    </Stack>
  );
};
