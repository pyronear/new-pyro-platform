import { Grid } from '@mui/material';

import type { CameraType } from '../../services/camera';
import { useIsMobile } from '../../utils/useIsMobile';
import { CameraCard } from './CameraCard';
import CamerasMap from './CamerasMap';

interface ViewMapProps {
  lastUpdate: number;
  isRefreshing: boolean;
  invalidateAndRefreshData: () => void;
  cameraList: CameraType[];
}

export const ViewMap = ({ cameraList }: ViewMapProps) => {
  const isMobile = useIsMobile();

  return (
    <Grid container direction={isMobile ? 'column-reverse' : 'row'}>
      <Grid
        size={isMobile ? 12 : 3}
        p={{ xs: 1, sm: 2 }}
        sx={{
          overflowY: isMobile ? 'unset' : 'auto',
          height: 'calc(100vh - 64px - 81px)', // To get scroll on the cards list only (= 100% - topbar height - tabs)
        }}
      >
        <Grid container spacing={{ xs: 1, sm: 2 }}>
          {cameraList.map((camera) => (
            <Grid size={12} key={camera.id}>
              <CameraCard camera={camera} isHorizontal />
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid size={isMobile ? 12 : 9} p={{ xs: 1, sm: 2 }}>
        {cameraList.length > 0 && <CamerasMap cameras={cameraList} />}
      </Grid>
    </Grid>
  );
};
