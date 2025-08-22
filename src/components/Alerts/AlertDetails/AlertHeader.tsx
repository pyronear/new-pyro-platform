import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Button,
  Grid,
  IconButton,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import moment from 'moment-timezone';

import smallLogo from '@/assets/small-logo.png';

import type {
  AlertType,
  SequenceWithCameraInfoType,
} from '../../../utils/alerts';
import { useIsMobile } from '../../../utils/useIsMobile';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';

interface AlertHeaderType {
  sequences: SequenceWithCameraInfoType[];
  selectedSequence: SequenceWithCameraInfoType;
  setSelectedSequence: (
    newSelectedSequence: SequenceWithCameraInfoType
  ) => void;
  resetAlert: () => void;
  alert: AlertType;
}

export const AlertHeader = ({
  sequences,
  selectedSequence,
  setSelectedSequence,
  resetAlert,
  alert,
}: AlertHeaderType) => {
  const isMobile = useIsMobile();
  const { t } = useTranslationPrefix('alerts');

  const camera = selectedSequence.camera;

  const handleCopyUrl = async () => {
    let url = '';
    if (alert.startedAt) {
      // Always create a historic link using alert's date
      const dateStr = moment(alert.startedAt).format('YYYY-MM-DD');
      url = `${window.location.origin}/history/${dateStr}/${alert.id}`;
    } else {
      // Fallback if no startedAt date is available
      url = window.location.href;
    }

    try {
      await navigator.clipboard.writeText(url);
      // You might want to show a toast notification here
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    const newSelectedSequence = sequences.find(
      (sequence) => sequence.id.toString() == event.target.value
    );
    if (newSelectedSequence) {
      setSelectedSequence(newSelectedSequence);
    }
  };

  const Title = (
    <Typography variant="h1">
      {t('titleSectionCamera')} {camera?.name ?? t('defaultCameraName')}
      {camera?.angle_of_view && ` (${camera.angle_of_view.toString()}°)`}
    </Typography>
  );

  const SequenceSelector = (
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

  return (
    <>
      {isMobile ? (
        <Grid container direction="row" alignItems="center" spacing={1}>
          <Grid size="auto">
            <IconButton
              aria-label={t('titleButtonBackAlt')}
              onClick={resetAlert}
            >
              <ArrowBackIcon />
            </IconButton>
          </Grid>
          <Grid size="grow">
            <Stack direction="column" spacing={1} alignItems="start">
              {Title}
              {SequenceSelector}
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <img src={smallLogo} height="26px" width="26px" />

            {Title}
            {SequenceSelector}
          </Stack>
          <Button
            aria-label={t('buttonImageDownloadAll')}
            size="small"
            sx={{ fontSize: '0.875rem', color: 'text.secondary' }}
            onClick={() => void handleCopyUrl()}
          >
            <ContentCopyIcon sx={{ marginRight: 0.5, fontSize: '1rem' }} />
            <span style={{ fontWeight: 500, textTransform: 'none' }}>Copy</span>
          </Button>
        </Stack>
      )}
    </>
  );
};
