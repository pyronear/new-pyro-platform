import Alert from '@mui/material/Alert';

import type { SequenceWithCameraInfoType } from '@/utils/alerts';

interface LiveSequenceInfoProps {
  sequence: SequenceWithCameraInfoType;
}
export const LiveSequenceInfo = ({ sequence }: LiveSequenceInfoProps) => {
  return (
    <Alert severity="error" icon={false}>
      {sequence.azimuth}
    </Alert>
  );
};
