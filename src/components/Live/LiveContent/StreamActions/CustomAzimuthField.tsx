import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import { useEffect, useState } from 'react';

import type { PoseCameraType } from '@/services/camera.ts';
import {
  getMoveToAzimuth,
  isAzimuthValid,
  LOADING_ACTION_BUTTON_TIMER_MS,
} from '@/utils/live';

import { useActionsOnCamera } from '../../context/useActionsOnCamera';

interface CustomAzimuthFieldProps {
  cameraId: number;
  poses: PoseCameraType[];
}

export const CustomAzimuthField = ({
  cameraId,
  poses,
}: CustomAzimuthFieldProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const { addStreamingAction } = useActionsOnCamera();

  const [azimuthToGo, setAzimuthToGo] = useState<string>('');
  const isAzimuthToGoInvalid = !isAzimuthValid(azimuthToGo);

  const onClickAzimuth = () => {
    const azimuthToGoInt = Number(azimuthToGo);
    if (!Number.isNaN(azimuthToGoInt)) {
      setIsLoading(true);
      setTimeoutId(
        window.setTimeout(() => {
          setIsLoading(false);
        }, LOADING_ACTION_BUTTON_TIMER_MS)
      );
      const move = getMoveToAzimuth(azimuthToGoInt, poses) ?? undefined;
      addStreamingAction({
        type: 'MOVE_TO_AZIMUTH',
        id: cameraId,
        params: { move },
      });
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutId != null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <OutlinedInput
      value={azimuthToGo}
      size="small"
      placeholder="0"
      color="primary"
      sx={{ width: '105px', paddingRight: 0 }}
      endAdornment={
        <InputAdornment position="end">
          <p>°</p>
          <IconButton
            disabled={!azimuthToGo || isAzimuthToGoInvalid}
            onClick={onClickAzimuth}
            loading={isLoading}
          >
            <SearchIcon />
          </IconButton>
        </InputAdornment>
      }
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        setAzimuthToGo(event.target.value);
      }}
      error={isAzimuthToGoInvalid}
    />
  );
};
