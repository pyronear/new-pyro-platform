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
      <Fab onClick={() => onClickMove('Up')} size="medium">
        <KeyboardArrowUpIcon />
      </Fab>
      <Stack direction="row" spacing={1} alignItems="center">
        <Fab onClick={() => onClickMove('Left')} size="medium">
          <KeyboardArrowLeftIcon />
        </Fab>
        <Fab size="small" onClick={onClickStop}>
          <CircleIcon />
        </Fab>
        <Fab onClick={() => onClickMove('Right')} size="medium">
          <KeyboardArrowRightIcon />
        </Fab>
      </Stack>
      <Fab onClick={() => onClickMove('Down')} size="medium">
        <KeyboardArrowDownIcon />
      </Fab>
    </Stack>
  );
};
