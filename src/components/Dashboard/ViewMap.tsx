import { Grid, Stack, useTheme } from '@mui/material';

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
  const theme = useTheme();
  const isMobile = useIsMobile();

  return (
    <Grid container direction={isMobile ? 'column-reverse' : 'row'}>
      <Grid
        size={isMobile ? 12 : 3}
        p={{ xs: 1, sm: 2 }}
        sx={{
          overflowY: 'auto',
          height: 'calc(100vh - 64px - 81px)', // To get scroll on the cards list only (= 100% - topbar height - tabs)
        }}
        bgcolor={theme.palette.customBackground.light}
      >
        <Stack spacing={{ xs: 1, sm: 2 }}>
          {cameraList.map((camera) => (
            <CameraCard key={camera.id} camera={camera} />
          ))}
        </Stack>
      </Grid>
      <Grid size={isMobile ? 12 : 9} p={{ xs: 1, sm: 2 }}>
        <CamerasMap cameras={cameraList} />
      </Grid>
    </Grid>
  );
};
