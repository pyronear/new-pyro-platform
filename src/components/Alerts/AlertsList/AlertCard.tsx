import {
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import Card from '@mui/material/Card';

import type { AlertType } from '../../../utils/alertsType';
import { formatToDateTime } from '../../../utils/dates';
import { useTranslationPrefix } from '../../../utils/useTranslationPrefix';

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
                {formatToDateTime(alert.startedAt)}
              </Typography>
            </Grid>
            <Grid>
              <Typography variant="caption">Time AGO</Typography>
            </Grid>
          </Grid>
          <Typography variant="h4">{t('prefixCardDetection')}</Typography>
          {alert.detections.map((detection) => (
            <Grid container key={detection.id} justifyContent="space-between">
              <Grid>
                <Typography variant="body1">{detection.name}</Typography>
              </Grid>
              <Grid>
                <Typography variant="caption">{detection.date}</Typography>
              </Grid>
            </Grid>
          ))}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
