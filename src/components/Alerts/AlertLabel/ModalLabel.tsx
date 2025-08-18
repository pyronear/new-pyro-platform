import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { labelBySequenceId } from '@/services/alerts';
import type { SequenceWithCameraInfoType } from '@/utils/alerts';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { SequenceLabelChip } from './SequenceLabelChip';

interface ModalLabelProps {
  open: boolean;
  invalidateAndRefreshData: () => void;
  handleClose: () => void;
  sequence: SequenceWithCameraInfoType;
  message: string | null;
}

type LabelType = 'fire' | 'nofire';

const toLabelType = (isWildfire: boolean | null): LabelType | null => {
  if (isWildfire === null) {
    return null;
  } else if (isWildfire) {
    return 'fire';
  } else {
    return 'nofire';
  }
};

const toIsWildfire = (labelType: LabelType | null): boolean | null => {
  if (labelType === null) {
    return null;
  } else if (labelType === 'fire') {
    return true;
  } else {
    return false;
  }
};

export const ModalLabel = ({
  open,
  message,
  handleClose,
  invalidateAndRefreshData,
  sequence,
}: ModalLabelProps) => {
  const { t } = useTranslationPrefix('alerts');
  const [selectedLabel, setSelectedLabel] = useState<LabelType | null>(null);

  useEffect(() => {
    // Initialize default value
    setSelectedLabel(toLabelType(sequence.isWildfire));
  }, [sequence]);

  const handleValidateButton = () => {
    const isWildfire = toIsWildfire(selectedLabel);
    void labelBySequenceId(sequence.id, isWildfire).then(() => {
      invalidateAndRefreshData();
      handleClose();
    });
  };

  const handleChangeRadioButton = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = (event.target as HTMLInputElement).value;
    setSelectedLabel(newValue as LabelType);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        {t('label.titleModal')}
        <span style={{ fontWeight: 'bold' }}>
          {sequence.camera?.name ?? t('defaultCameraName')}
        </span>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1}>
          <FormControl sx={{ alignSelf: 'center' }}>
            <FormLabel>{t('label.titleRadioButtonsModal')}</FormLabel>
            <RadioGroup
              value={selectedLabel}
              onChange={handleChangeRadioButton}
            >
              {(['fire', 'nofire'] as LabelType[]).map((value) => (
                <FormControlLabel
                  key={value}
                  value={value}
                  control={<Radio />}
                  label={<SequenceLabelChip isWildfire={toIsWildfire(value)} />}
                />
              ))}
            </RadioGroup>
          </FormControl>
          {message && (
            <Alert severity="info" sx={{ margin: 0 }}>
              <Typography textAlign="start">{message}</Typography>
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          {t('label.buttonCancelModal')}
        </Button>
        <Button
          onClick={handleValidateButton}
          variant="contained"
          disabled={selectedLabel === null}
        >
          {t('label.buttonValidateModal')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
