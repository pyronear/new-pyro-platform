import { Grid } from '@mui/material';

import type { CameraType } from '../../services/camera';
import { CameraCard } from './CameraCard';

interface ViewCardsProps {
  lastUpdate: number;
  isRefreshing: boolean;
  invalidateAndRefreshData: () => void;
  cameraList: CameraType[];
}

export const ViewCards = ({ cameraList }: ViewCardsProps) => {
  return (
    <Grid
      container
      spacing={{ xs: 1, md: 2 }}
      p={{ xs: 1, md: 2 }}
      overflow={'auto'}
      height={'100%'}
    >
      {cameraList.map((camera) => (
        <Grid
          key={camera.id}
          size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          minHeight={0}
        >
          <CameraCard camera={camera} />
        </Grid>
      ))}
    </Grid>
  );
};
