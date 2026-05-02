import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import {
  Box,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Card from '@mui/material/Card';

import { CameraName } from '@/components/Common/Camera/CameraName';
import { type AlertType, formatAzimuth } from '@/utils/alerts';
import { formatIsoToDate, formatIsoToTime } from '@/utils/dates';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { SequenceLabelChip } from '../AlertLabel/SequenceLabelChip';
import { AlertStartedTimeAgo } from './AlertStartedTimeAgo';

interface AlertCardType {
  isActive: boolean;
  setActive: () => void;
  alert: AlertType;
  isLiveMode: boolean;
}

export const AlertCard = ({
  isActive,
  setActive,
  alert,
  isLiveMode,
}: AlertCardType) => {
  const theme = useTheme();
  const { t } = useTranslationPrefix('alerts');

  return (
    <Card>
      <CardActionArea
        onClick={setActive}
        data-active={isActive ? '' : undefined}
        sx={{
          height: '100%',
          '&[data-active]': {
            backgroundColor: 'action.selected',
            borderLeft: `3px solid ${theme.palette.error.main}`,
            '&:hover': {
              backgroundColor: 'action.selectedHover',
            },
          },
        }}
      >
        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            marginBottom={0.5}
          >
            <Typography variant="caption">
              {formatIsoToDate(alert.startedAt)}
            </Typography>
            {isLiveMode && <AlertStartedTimeAgo alert={alert} />}
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            marginBottom={0.5}
          >
            <VideocamOutlinedIcon fontSize="small" />
            <Typography variant="h3">{t('prefixCardDetection')}</Typography>
          </Stack>
          <Stack spacing={0.75}>
            {alert.sequences.map((sequence) => (
              <Stack key={sequence.id} spacing={0.25}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ minWidth: 0 }}
                >
                  <SequenceLabelChip
                    isSmall
                    labelWildfire={sequence.labelWildfire}
                  />
                  {sequence.camera && (
                    <Box
                      sx={{
                        minWidth: 0,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <CameraName camera={sequence.camera} />
                    </Box>
                  )}
                </Stack>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Typography variant="caption" fontWeight={500}>
                    {formatAzimuth(sequence.azimuth)}
                  </Typography>
                  <Typography variant="caption">
                    {formatIsoToTime(sequence.startedAt)}
                  </Typography>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
