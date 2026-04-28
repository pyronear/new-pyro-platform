import { List } from '@mui/material';

import type { CameraType } from '@/services/camera';

import { CameraName } from './CameraName';
import { SelectableItemList } from './SelectableItemList';

interface CamerasListSelectableProps {
  cameras: CameraType[];
  selectedCameraId: number | null;
  setSelectedCameraId: (newCameraId: number) => void;
}

export const CamerasListSelectable = ({
  cameras,
  selectedCameraId,
  setSelectedCameraId,
}: CamerasListSelectableProps) => {
  return (
    <List>
      {cameras.map((camera) => (
        <SelectableItemList
          selected={camera.id == selectedCameraId}
          itemId={camera.id}
          onClick={setSelectedCameraId}
          key={camera.id}
        >
          <CameraName camera={camera} />
        </SelectableItemList>
      ))}
    </List>
  );
};
