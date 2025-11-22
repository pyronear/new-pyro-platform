import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { Stack, Switch } from '@mui/material';

interface AlertVolumeToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

export const AlertVolumeToggle = ({
  isActive,
  onToggle,
}: AlertVolumeToggleProps) => {
  return (
    <Stack direction="row" alignItems="center">
      <VolumeOffIcon />
      <Switch checked={isActive} onChange={onToggle} />
      <VolumeUpIcon />
    </Stack>
  );
};
