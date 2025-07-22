import {
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';

import type { SequenceWithCameraInfoType } from '../../../utils/alerts';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';

interface AlertHeaderType {
  sequences: SequenceWithCameraInfoType[];
  selectedSequence: SequenceWithCameraInfoType;
  setSelectedSequence: (
    newSelectedSequence: SequenceWithCameraInfoType
  ) => void;
}

export const AlertHeader = ({
  sequences,
  selectedSequence,
  setSelectedSequence,
}: AlertHeaderType) => {
  const { t } = useTranslationPrefix('alerts');

  const camera = selectedSequence.camera;

  const handleChange = (event: SelectChangeEvent) => {
    const newSelectedSequence = sequences.find(
      (sequence) => sequence.id.toString() == event.target.value
    );
    if (newSelectedSequence) {
      setSelectedSequence(newSelectedSequence);
    }
  };

  return (
    <Stack direction="row" spacing={3} alignItems="center">
      <Typography variant="h1">
        {t('titleSectionCamera')}: {camera?.name ?? t('defaultCameraName')}
        {camera?.angle_of_view && ` (${camera.angle_of_view.toString()}°)`}
      </Typography>
      <Select
        value={selectedSequence.id.toString()}
        onChange={handleChange}
        sx={{ height: 24, minWidth: 200 }}
      >
        {sequences.map((sequence) => (
          <MenuItem key={sequence.id} value={sequence.id}>
            {sequence.camera?.name}
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
};
