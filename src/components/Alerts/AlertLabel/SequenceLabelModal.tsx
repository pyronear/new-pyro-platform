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

import type { SequenceWithCameraInfoType } from '@/utils/alerts';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { SequenceLabelChip } from './SequenceLabelChip';

interface SequenceLabelProps {
  open: boolean;
  handleCancel: () => void;
  handleValidate: (isWildfire: boolean | null) => void;
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

export const SequenceLabelModal = ({
  open,
  message,
  handleCancel,
  handleValidate,
  sequence,
}: SequenceLabelProps) => {
  const { t } = useTranslationPrefix('alerts');
  const [selectedLabel, setSelectedLabel] = useState<LabelType | null>(null);

  useEffect(() => {
    // Initialize default value
    setSelectedLabel(toLabelType(sequence.isWildfire));
  }, [sequence]);

  const handleChangeRadioButton = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = (event.target as HTMLInputElement).value;
    setSelectedLabel(newValue as LabelType);
  };

  return (
    <Dialog onClose={handleCancel} open={open}>
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
        <Button autoFocus onClick={handleCancel}>
          {t('label.buttonCancelModal')}
        </Button>
        <Button
          onClick={() => handleValidate(toIsWildfire(selectedLabel))}
          variant="contained"
          disabled={selectedLabel === null}
        >
          {t('label.buttonValidateModal')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
