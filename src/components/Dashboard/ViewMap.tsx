import { Grid, Stack } from '@mui/material';

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
    <Grid
      container
      direction={isMobile ? 'column-reverse' : 'row'}
      height={'100%'}
    >
      {!isMobile && (
        <Grid
          size={3}
          p={{ xs: 1, sm: 2 }}
          sx={{
            overflowY: 'auto',
            height: '100%',
          }}
        >
          <Stack spacing={{ xs: 1, sm: 2 }} height={'100%'}>
            {cameraList.map((camera) => (
              <CameraCard key={camera.id} camera={camera} isHorizontal />
            ))}
          </Stack>
        </Grid>
      )}
      <Grid size={!isMobile && 9} p={{ xs: 1, sm: 2 }}>
        {cameraList.length > 0 && <CamerasMap cameras={cameraList} />}
      </Grid>
    </Grid>
  );
};
