import CircleIcon from '@mui/icons-material/Circle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Stack } from '@mui/material';

import { FabLoading } from '@/components/Live/LiveContent/StreamActions/FabLoading.tsx';
import { type CameraDirectionType } from '@/services/live';

import { useActionsOnCamera } from '../../context/useActionsOnCamera';

interface NavigationButtonsProps {
  cameraId: number;
  speed: number;
}

export const NavigationButtons = ({
  cameraId,
  speed,
}: NavigationButtonsProps) => {
  const { addStreamingAction } = useActionsOnCamera();

  const onClickMove = (direction: CameraDirectionType) => {
    addStreamingAction({
      type: 'MOVE',
      id: cameraId,
      params: { move: { direction, speed } },
    });
  };

  const onClickStop = () => {
    addStreamingAction({
      type: 'STOP',
      id: cameraId,
      params: {},
    });
  };

  return (
    <Stack alignItems="center">
      <FabLoading onClick={() => onClickMove('Up')}>
        <KeyboardArrowUpIcon />
      </FabLoading>
      <Stack direction="row" spacing={1} alignItems="center">
        <FabLoading onClick={() => onClickMove('Left')}>
          <KeyboardArrowLeftIcon />
        </FabLoading>
        <FabLoading isSmall onClick={onClickStop}>
          <CircleIcon />
        </FabLoading>
        <FabLoading onClick={() => onClickMove('Right')}>
          <KeyboardArrowRightIcon />
        </FabLoading>
      </Stack>
      <FabLoading onClick={() => onClickMove('Down')}>
        <KeyboardArrowDownIcon />
      </FabLoading>
    </Stack>
  );
};
