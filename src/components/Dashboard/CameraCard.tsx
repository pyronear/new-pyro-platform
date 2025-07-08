import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { CardContent, CardMedia, Grid, Stack, Typography } from '@mui/material';
import Card from '@mui/material/Card';

import tree from '../../assets/tree-silhouette.svg';
import type { CameraType } from '../../services/camera';

interface CameraCardType {
  camera: CameraType;
}

export const CameraCard = ({ camera }: CameraCardType) => {
  return (
    <Card sx={{ height: '100%' }}>
      {/* TODO : fetch last image */}
      <CardMedia sx={{ height: 250 }} image={tree} title="Last Image" />
      <CardContent>
        <Grid container direction="column" spacing={2}>
          <Typography variant="h4">{camera.name}</Typography>
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
