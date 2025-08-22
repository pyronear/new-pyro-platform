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
import { Link } from 'react-router-dom';

import type { AlertType } from '../../../utils/alerts';
import { formatToDate, formatToTime } from '../../../utils/dates';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';
import { CameraName } from '../../Common/CameraName';

interface HistoryAlertCardType {
  isActive: boolean;
  alert: AlertType;
  date: string; // YYYY-MM-DD format
}

export const HistoryAlertCard = ({
  isActive,
  alert,
  date,
}: HistoryAlertCardType) => {
  const theme = useTheme();
  const { t } = useTranslationPrefix('alerts');

  return (
    <Card sx={{ borderRadius: '2px' }}>
      <CardActionArea
        component={Link}
        to={`/history/${date}/${alert.id}`}
        data-active={isActive ? '' : undefined}
        sx={{
          height: '100%',
          color: 'inherit',
          textDecoration: 'none',
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
