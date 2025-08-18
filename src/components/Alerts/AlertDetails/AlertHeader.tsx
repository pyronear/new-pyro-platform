import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Grid,
  IconButton,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';

import smallLogo from '@/assets/small-logo.png';
import {
  countUnlabelledSequences,
  type SequenceWithCameraInfoType,
} from '@/utils/alerts';
import { useIsMobile } from '@/utils/useIsMobile';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { SequenceLabelContainer } from '../AlertLabel/SequenceLabelContainer';

interface AlertHeaderType {
  isLiveMode: boolean;
  invalidateAndRefreshData: () => void;
  sequences: SequenceWithCameraInfoType[];
  selectedSequence: SequenceWithCameraInfoType;
  setSelectedSequence: (
    newSelectedSequence: SequenceWithCameraInfoType
  ) => void;
  resetAlert: () => void;
}

export const AlertHeader = ({
  isLiveMode,
  invalidateAndRefreshData,
  sequences,
  selectedSequence,
  setSelectedSequence,
  resetAlert,
}: AlertHeaderType) => {
  const isMobile = useIsMobile();
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

  const SequenceLabel = (
    <SequenceLabelContainer
      sequence={selectedSequence}
      isLiveMode={isLiveMode}
      invalidateAndRefreshData={invalidateAndRefreshData}
      nbSequencesToBeLabelled={countUnlabelledSequences(sequences)}
    />
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
              {SequenceLabel}
              {SequenceSelector}
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <img src={smallLogo} height="26px" width="26px" />
            {Title}
            {SequenceLabel}
          </Stack>
          {SequenceSelector}
        </Stack>
      )}
    </>
  );
};
