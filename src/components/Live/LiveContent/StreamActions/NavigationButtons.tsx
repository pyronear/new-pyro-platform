import CircleIcon from '@mui/icons-material/Circle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Fab, Stack } from '@mui/material';

import { type CameraDirectionType } from '@/services/live';

import type { StreamingAction } from '../../hooks/useStreamingActions';

interface NavigationButtonsProps {
  cameraIp: string;
  addStreamingAction: (newAction: StreamingAction) => void;
  speed: number;
}

export const NavigationButtons = ({
  cameraIp,
  addStreamingAction,
  speed,
}: NavigationButtonsProps) => {
  const onClickMove = (direction: CameraDirectionType) => {
    addStreamingAction({
      type: 'MOVE',
      ip: cameraIp,
      params: { move: { direction, speed } },
    });
  };

  const onClickStop = () => {
    addStreamingAction({
      type: 'STOP',
      ip: cameraIp,
      params: {},
    });
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
