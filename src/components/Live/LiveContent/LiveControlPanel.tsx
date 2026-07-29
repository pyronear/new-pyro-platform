import { Stack, useTheme } from '@mui/material';

import type { CameraAzimuthType } from '@/services/live.ts';
import { type AlertType, getSequenceByCameraId } from '@/utils/alerts';
import type { CameraFullInfosType, SiteType } from '@/utils/camera';

import { SelectionCameraWithAlert } from './Control/SelectionCameraWithAlert';
import { SelectionCameraWithoutAlert } from './Control/SelectionCameraWithoutAlert';
import LiveMap from './LiveMap';

interface LiveControlPanelProps {
  sites: SiteType[];
  selectedSite: SiteType;
  selectedCamera: CameraFullInfosType | null;
  changeCamera: (newSite: SiteType, newCameraId: number | null) => void;
  liveAzimuth: CameraAzimuthType | null;
  alert?: AlertType;
}

export const LiveControlPanel = ({
  sites,
  selectedSite,
  changeCamera,
  selectedCamera,
  liveAzimuth,
  alert,
}: LiveControlPanelProps) => {
  const theme = useTheme();
  const currentSequence =
    alert && selectedCamera
      ? getSequenceByCameraId(alert, selectedCamera.id)
      : undefined;

  return (
    <Stack
      spacing={1}
      height="100%"
      p={2}
      sx={{ backgroundColor: theme.palette.customBackground.light }}
    >
      {alert ? (
        <SelectionCameraWithAlert
          sites={sites}
          selectedCamera={selectedCamera}
          changeCamera={changeCamera}
          alert={alert}
          currentSequence={currentSequence}
        />
      ) : (
        <SelectionCameraWithoutAlert
          sites={sites}
          selectedSite={selectedSite}
          selectedCamera={selectedCamera}
          changeCamera={changeCamera}
        />
      )}

      <div style={{ flexGrow: 1 }}>
        {selectedCamera && (
          <LiveMap
            camera={selectedCamera}
            sequence={currentSequence}
            liveAzimuth={liveAzimuth}
          />
        )}
      </div>
    </Stack>
  );
};
