import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import { Button, Stack, Typography } from '@mui/material';
import { Popup } from 'react-leaflet';

import { CameraName } from '@/components/Common/Camera/CameraName.tsx';
import {
  formatAzimuth,
  type SequenceWithCameraInfoType,
} from '@/utils/alerts.ts';
import { formatIsoToTime } from '@/utils/dates.ts';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix.ts';

interface SequencePopupProps {
  sequence: SequenceWithCameraInfoType;
  closeMap: () => void;
}

export const SequencePopup = ({ sequence, closeMap }: SequencePopupProps) => {
  const { t } = useTranslationPrefix('alerts');

  return (
    <Popup>
      <Stack>
        <Stack>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            marginBottom={0.5}
          >
            <VideocamOutlinedIcon fontSize="small" />
            <Typography variant="h3">{t('prefixCardDetection')}</Typography>
          </Stack>
          {sequence.camera && <CameraName camera={sequence.camera} />}
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption" fontWeight={500}>
            {formatAzimuth(sequence.azimuth)}
          </Typography>
          <Typography variant="caption">
            {formatIsoToTime(sequence.startedAt)}
          </Typography>
        </Stack>
        <div>
          <Button onClick={closeMap}>{t('buttonDisplayDetail')}</Button>
        </div>
      </Stack>
    </Popup>
  );
};
