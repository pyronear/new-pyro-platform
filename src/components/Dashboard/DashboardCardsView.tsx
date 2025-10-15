import { Grid } from '@mui/material';

import type { CameraType } from '../../services/camera';
import { CameraCard } from './CameraCard/CameraCard';

interface ViewCardsProps {
  lastUpdate: number;
  isRefreshing: boolean;
  invalidateAndRefreshData: () => void;
  cameraList: CameraType[];
}

export const DashboardCardsView = ({ cameraList }: ViewCardsProps) => {
  return (
    <div style={{ overflow: 'auto', height: '100%' }}>
      <Grid container spacing={{ xs: 1, md: 2 }} m={{ xs: 1, md: 2 }}>
        {cameraList.map((camera) => (
          <Grid key={camera.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <CameraCard camera={camera} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};
