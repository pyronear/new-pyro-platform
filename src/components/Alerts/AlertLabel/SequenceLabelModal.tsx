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

import type {
  LabelWildfireValues,
  SequenceWithCameraInfoType,
} from '@/utils/alerts';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { SequenceLabelChip } from './SequenceLabelChip';

interface SequenceLabelProps {
  open: boolean;
  handleCancel: () => void;
  handleValidate: (newLabel: LabelWildfireValues) => void;
  sequence: SequenceWithCameraInfoType;
  message: string | null;
}

export const SequenceLabelModal = ({
  open,
  message,
  handleCancel,
  handleValidate,
  sequence,
}: SequenceLabelProps) => {
  const { t } = useTranslationPrefix('alerts');
  const [selectedLabel, setSelectedLabel] = useState<LabelWildfireValues>(null);

  useEffect(() => {
    // Initialize default value
    setSelectedLabel(sequence.labelWildfire);
  }, [sequence]);

  const handleChangeRadioButton = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = (event.target as HTMLInputElement).value;
    setSelectedLabel(newValue as LabelWildfireValues);
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
              {(
                [
                  'wildfire_smoke',
                  'other_smoke',
                  'other',
                ] as LabelWildfireValues[]
              ).map((value) => (
                <FormControlLabel
                  key={value}
                  value={value}
                  control={<Radio />}
                  label={<SequenceLabelChip labelWildfire={value} />}
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
          onClick={() => handleValidate(selectedLabel)}
          variant="contained"
          disabled={selectedLabel === null}
        >
          {t('label.buttonValidateModal')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
