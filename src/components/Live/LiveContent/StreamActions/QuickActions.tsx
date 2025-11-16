import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import SearchIcon from '@mui/icons-material/Search';
import SpeedIcon from '@mui/icons-material/Speed';
import {
  Button,
  ButtonGroup,
  Divider,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';

import { getMoveToAzimuth, isAzimuthValid } from '@/utils/live';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { useActionsOnCamera } from '../../context/useActionsOnCamera';

interface QuickActionsProps {
  cameraIp: string;
  poses: number[];
  azimuths: number[];
  speedName: number;
  nextSpeed: () => void;
}

export const QuickActions = ({
  cameraIp,
  poses,
  azimuths,
  speedName,
  nextSpeed,
}: QuickActionsProps) => {
  const theme = useTheme();
  const { t } = useTranslationPrefix('live');
  const { addStreamingAction } = useActionsOnCamera();
  const [azimuthToGo, setAzimuthToGo] = useState<string>('');
  const isAzimuthToGoInvalid = !isAzimuthValid(azimuthToGo);

  const onClickDirection = (pose: number) => {
    addStreamingAction({
      type: 'MOVE',
      ip: cameraIp,
      params: { move: { poseId: pose } },
    });
  };

  const onClickAzimuth = () => {
    const azimuthToGoInt = Number(azimuthToGo);
    if (!Number.isNaN(azimuthToGoInt)) {
      const move =
        getMoveToAzimuth(azimuthToGoInt, azimuths, poses) ?? undefined;
      addStreamingAction({
        type: 'MOVE_TO_AZIMUTH',
        ip: cameraIp,
        params: { move },
      });
    }
  };

  return (
    <Stack
      divider={<Divider flexItem orientation="vertical" />}
      direction="row"
      spacing={2}
      sx={{
        padding: 1,
        backgroundColor: theme.palette.customBackground.light,
        borderRadius: '4px',
      }}
    >
      <Tooltip title={t('tooltipSpeed')}>
        <Stack direction="row" alignItems="center">
          <SpeedIcon />
          <Button onClick={nextSpeed} sx={{ minWidth: '50px' }}>
            x{speedName}
          </Button>
        </Stack>
      </Tooltip>

      <Tooltip title={t('tooltipPrerecordedAzimuths')}>
        <Stack direction="row" spacing={2} alignItems="center">
          <ExploreOutlinedIcon />
          <ButtonGroup>
            {poses.map((pose, index) => (
              <Button key={pose} onClick={() => onClickDirection(pose)}>
                <Typography p="2px">{azimuths[index]}°</Typography>
              </Button>
            ))}
          </ButtonGroup>
        </Stack>
      </Tooltip>
      <Tooltip title={t('tooltipCustomAzimuths')}>
        <OutlinedInput
          value={azimuthToGo}
          size="small"
          sx={{ width: '105px', paddingRight: 0 }}
          endAdornment={
            <InputAdornment position="end">
              <p>°</p>
              <IconButton
                disabled={!azimuthToGo || isAzimuthToGoInvalid}
                onClick={onClickAzimuth}
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
      </Tooltip>
    </Stack>
  );
};
