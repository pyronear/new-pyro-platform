import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { CardContent, CardMedia, Grid, Stack, Typography } from '@mui/material';
import Card from '@mui/material/Card';

import noImage from '../../assets/no-image.svg';
import type { CameraType } from '../../services/camera';
import { CameraName } from '../Common/CameraName';

interface CameraCardType {
  camera: CameraType;
}

export const CameraCard = ({ camera }: CameraCardType) => {
  return (
    <Card sx={{ height: '100%' }}>
      {/* TODO : fetch last image */}
      <CardMedia sx={{ height: 250 }} image={noImage} title="Last Image" />
      <CardContent>
        <Grid container direction="column" spacing={2}>
          <CameraName name={camera.name} angle_of_view={camera.angle_of_view} />
          <Stack spacing={1} direction="row" alignItems="center">
            <AccessTimeIcon />
            {/* TODO : add formatting and error if too old */}
            <Typography variant="caption">{camera.last_active_at}</Typography>
          </Stack>
        </Grid>
      </CardContent>
    </Card>
  );
};
