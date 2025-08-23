import { MenuItem, Select, type SelectChangeEvent } from '@mui/material';

import type { SequenceWithCameraInfoType } from '../../../utils/alerts';
import { useIsMobile } from '../../../utils/useIsMobile';

interface SequenceSelectorProps {
  sequences: SequenceWithCameraInfoType[];
  selectedSequence: SequenceWithCameraInfoType;
  handleChange: (event: SelectChangeEvent) => void;
}

export const SequenceSelector = ({
  sequences,
  selectedSequence,
  handleChange,
}: SequenceSelectorProps) => {
  const isMobile = useIsMobile();
  return (
    <Select
      value={selectedSequence.id.toString()}
      onChange={handleChange}
      sx={{ height: 24, minWidth: isMobile ? 200 : 50 }}
    >
      {sequences.map((sequence) => (
        <MenuItem key={sequence.id} value={sequence.id}>
          {sequence.camera?.name}
        </MenuItem>
      ))}
    </Select>
  );
};
