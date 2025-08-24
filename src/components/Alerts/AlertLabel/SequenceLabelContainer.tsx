import { type ReactNode, useMemo, useState } from 'react';

import type { SequenceWithCameraInfoType } from '@/utils/alerts';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { ModalLabel } from './ModalLabel';
import { SequenceLabelChip } from './SequenceLabelChip';

interface SequenceLabelContainerProps {
  sequence: SequenceWithCameraInfoType;
  isLiveMode: boolean;
  invalidateAndRefreshData: () => void;
  renderCustomButton?: (onClick: () => void) => ReactNode; // To use another component than the chip
  nbSequencesLabelled?: number;
  nbTotalSequences?: number;
}
export const SequenceLabelContainer = ({
  sequence,
  isLiveMode,
  invalidateAndRefreshData,
  renderCustomButton = undefined,
  nbSequencesLabelled = 0,
  nbTotalSequences = 1,
}: SequenceLabelContainerProps) => {
  const { t } = useTranslationPrefix('alerts.label');
  const [open, setOpen] = useState(false);
  const isWildfire = sequence.isWildfire ?? null;
  const onClick = () => setOpen(true);

  const message = useMemo(() => {
    if (isLiveMode) {
      if (nbTotalSequences > 1) {
        return t('multipleSequencesMessageModal').replace(
          '%s',
          `${nbSequencesLabelled}/${nbTotalSequences}`
        );
      } else {
        return t('lastSequenceMessageModal');
      }
    }
    return null;
  }, [isLiveMode, nbTotalSequences, nbSequencesLabelled, t]);

  return (
    <>
      {renderCustomButton ? (
        renderCustomButton(onClick)
      ) : (
        <SequenceLabelChip
          isWildfire={isWildfire}
          clickable={true}
          onClick={onClick}
        />
      )}
      <ModalLabel
        open={open}
        handleClose={() => setOpen(false)}
        invalidateAndRefreshData={invalidateAndRefreshData}
        sequence={sequence}
        message={message}
      />
    </>
  );
};
