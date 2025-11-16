import { Stack } from '@mui/material';

import type { AlertType } from '@/utils/alerts';
import type { CameraFullInfosType, SiteType } from '@/utils/camera';

import { SelectionCameraWithAlert } from './Control/SelectionCameraWithAlert';
import { SelectionCameraWithoutAlert } from './Control/SelectionCameraWithoutAlert';
import LiveMap from './LiveMap';

interface LiveControlPanelProps {
  sites: SiteType[];
  selectedSite: SiteType;
  selectedCamera: CameraFullInfosType | null;
  changeCamera: (newSite: SiteType, newCameraId: number | null) => void;
  alert?: AlertType;
}

export const LiveControlPanel = ({
  sites,
  selectedSite,
  changeCamera,
  selectedCamera,
  alert,
}: LiveControlPanelProps) => {
  const currentSequence = alert?.sequences.find(
    (seq) => seq.camera?.id === selectedCamera?.id
  );

  return (
    <Stack spacing={1} height="100%">
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
          <LiveMap camera={selectedCamera} sequence={currentSequence} />
        )}
      </div>
    </Stack>
  );
};
