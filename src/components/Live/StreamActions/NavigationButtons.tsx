import CircleIcon from '@mui/icons-material/Circle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Fab, Stack } from '@mui/material';

import {
  type CameraDirectionType,
  moveCamera,
  stopCamera,
} from '@/services/live';

import { CustomFab } from './CustomFab';

interface NavigationButtonsProps {
  cameraIp: string;
  speed: number;
}

export const NavigationButtons = ({
  cameraIp,
  speed,
}: NavigationButtonsProps) => {
  const onClickMove = (direction: CameraDirectionType) => {
    void moveCamera(cameraIp, direction, speed, undefined, undefined);
  };

  const onClickStop = () => {
    void stopCamera(cameraIp);
  };

  return (
    <Stack alignItems="center">
      <CustomFab onClick={() => onClickMove('Up')}>
        <KeyboardArrowUpIcon />
      </CustomFab>
      <Stack direction="row" spacing={1} alignItems="center">
        <CustomFab onClick={() => onClickMove('Left')}>
          <KeyboardArrowLeftIcon />
        </CustomFab>
        <Fab size="small" onClick={onClickStop}>
          <CircleIcon />
        </Fab>
        <CustomFab onClick={() => onClickMove('Right')}>
          <KeyboardArrowRightIcon />
        </CustomFab>
      </Stack>
      <CustomFab onClick={() => onClickMove('Down')}>
        <KeyboardArrowDownIcon />
      </CustomFab>
    </Stack>
  );
};
