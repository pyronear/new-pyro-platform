import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import {
  CardActionArea,
  CardContent,
  Grid,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import Card from '@mui/material/Card';

import { type AlertType, formatAzimuth } from '@//utils/alerts';
import { formatToDate, formatToTime } from '@//utils/dates';
import { CameraName } from '@/components/Common/Camera/CameraName';
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
        <CardContent>
          <Grid container marginBottom="1rem" justifyContent="space-between">
            <Grid>
              <Typography variant="caption">
                {formatToDate(alert.startedAt)}
              </Typography>
            </Grid>
            {isLiveMode && (
              <Grid>
                <AlertStartedTimeAgo alert={alert} />
              </Grid>
            )}
          </Grid>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            marginBottom={1}
          >
            <VideocamOutlinedIcon fontSize="small" />
            <Typography variant="h3">{t('prefixCardDetection')}</Typography>
          </Stack>
          <Stack spacing={1}>
            {alert.sequences.map((sequence) => (
              <Stack
                direction="row"
                key={sequence.id}
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <SequenceLabelChip
                    isSmall
                    labelWildfire={sequence.labelWildfire}
                  />
                  {sequence.camera && <CameraName camera={sequence.camera} />}
                </Stack>

                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="end"
                  flexGrow={1}
                >
                  <Typography variant="caption" fontWeight={500}>
                    {formatAzimuth(sequence.coneAzimuth)}
                  </Typography>

                  <Typography variant="caption">
                    {formatToTime(alert.startedAt)}
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
