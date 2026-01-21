import { type ReactNode, useMemo, useState } from 'react';

import { labelBySequenceId } from '@/services/alerts';
import type { SequenceWithCameraInfoType } from '@/utils/alerts';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { SequenceLabelChip } from './SequenceLabelChip';
import { SequenceLabelModal } from './SequenceLabelModal';
import { SequenceLabelSnackbar } from './SequenceLabelSnackbar';

interface SequenceLabelContainerProps {
  sequence: SequenceWithCameraInfoType;
  isLiveMode: boolean;
  invalidateAndRefreshData: () => void;
  renderCustomButton?: (onClick: () => void) => ReactNode; // To use another component than the chip
  nbSequencesToBeLabelled: number;
}
export const SequenceLabelContainer = ({
  sequence,
  isLiveMode,
  invalidateAndRefreshData,
  renderCustomButton,
  nbSequencesToBeLabelled,
}: SequenceLabelContainerProps) => {
  const { t } = useTranslationPrefix('alerts.label');
  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isCallSuccessful, setCallSuccessful] = useState<boolean | null>(null);

  const handleOpen = () => setOpenModal(true);

  const handleCancel = () => setOpenModal(false);

  const handleValidate = (isWildfire: string | null) => {
    void labelBySequenceId(sequence.id, isWildfire)
      .then(() => {
        setCallSuccessful(true);
        invalidateAndRefreshData();
        setOpenModal(false);
      })
      .catch(() => {
        setCallSuccessful(false);
      })
      .finally(() => {
        setOpenSnackbar(true);
      });
  };

  const messageModal = useMemo(() => {
    if (isLiveMode) {
      return nbSequencesToBeLabelled > 1
        ? t('modalMessage.multipleSequences').replace(
            '%s',
            nbSequencesToBeLabelled.toString()
          )
        : t('modalMessage.lastSequence');
    }
    return null;
  }, [isLiveMode, nbSequencesToBeLabelled, t]);

  const messageSnackbar = useMemo(() => {
    if (isCallSuccessful) {
      if (isLiveMode) {
        return nbSequencesToBeLabelled > 1
          ? t('saveSuccessMessage.multipleSequences')
          : t('saveSuccessMessage.lastSequence');
      } else {
        return t('saveSuccessMessage.history');
      }
    } else {
      return t('saveErrorMessage');
    }
  }, [isCallSuccessful, isLiveMode, nbSequencesToBeLabelled, t]);

  return (
    <>
      {renderCustomButton ? (
        renderCustomButton(handleOpen)
      ) : (
        <SequenceLabelChip
          labelWildfire={sequence.labelWildfire}
          clickable={true}
          onClick={handleOpen}
        />
      )}
      <SequenceLabelModal
        open={openModal}
        handleCancel={handleCancel}
        handleValidate={handleValidate}
        sequence={sequence}
        message={messageModal}
      />
      <SequenceLabelSnackbar
        open={openSnackbar}
        handleClose={() => setOpenSnackbar(false)}
        isSuccess={isCallSuccessful}
        message={messageSnackbar}
      />
    </>
  );
};
