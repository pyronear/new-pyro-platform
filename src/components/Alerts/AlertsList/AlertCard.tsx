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

import type { AlertType } from '../../../utils/alerts';
import { formatToDate, formatToTime } from '../../../utils/dates';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';
import { CameraName } from '../../Common/CameraName';

interface AlertCardType {
  isActive: boolean;
  setActive: () => void;
  alert: AlertType;
}

export const AlertCard = ({ isActive, setActive, alert }: AlertCardType) => {
  const theme = useTheme();
  const { t } = useTranslationPrefix('alerts');

  return (
    <Card sx={{ borderRadius: '2px' }}>
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
            <Grid>
              <Typography variant="caption">Time AGO</Typography>
            </Grid>
          </Grid>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            marginBottom={1}
          >
            <VideocamOutlinedIcon fontSize="small" />
            <Typography variant="h4">{t('prefixCardDetection')}</Typography>
          </Stack>
          {alert.sequences.map((sequence) => (
            <Grid
              container
              key={sequence.id}
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid>
                {sequence.camera && (
                  <CameraName
                    name={sequence.camera.name}
                    angle_of_view={sequence.camera.angle_of_view}
                  />
                )}
              </Grid>
              <Grid flexGrow={1}>
                <Stack direction="row" spacing={1} justifyContent="end">
                  {sequence.azimuth != null && (
                    <Typography variant="caption" fontWeight={500}>
                      {sequence.azimuth}°
                    </Typography>
                  )}
                  <Typography variant="caption">
                    {formatToTime(alert.startedAt)}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          ))}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
