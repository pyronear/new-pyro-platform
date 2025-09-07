import VideocamIcon from '@mui/icons-material/Videocam';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import type { CameraType } from '@/services/camera';

import { CameraName } from './CameraName';

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
        <ListItem disablePadding disableGutters key={camera.id}>
          <ListItemButton
            selected={camera.id == selectedCameraId}
            onClick={() => setSelectedCameraId(camera.id)}
          >
            {camera.id == selectedCameraId && (
              <ListItemIcon>
                <VideocamIcon fontSize="small" />
              </ListItemIcon>
            )}
            <ListItemText inset={camera.id != selectedCameraId}>
              <CameraName
                name={camera.name}
                angle_of_view={camera.angle_of_view}
              />
            </ListItemText>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
