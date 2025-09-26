import ExploreIcon from '@mui/icons-material/Explore';
import SpeedIcon from '@mui/icons-material/Speed';
import {
  Button,
  ButtonGroup,
  Divider,
  Stack,
  Tooltip,
  useTheme,
} from '@mui/material';

import { moveCamera } from '@/services/live';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

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

  const onClickDirection = (pose: number) => {
    void moveCamera(cameraIp, undefined, undefined, pose, undefined);
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

      <Tooltip title={t('tooltipAzimuths')}>
        <Stack direction="row" spacing={2} alignItems="center">
          <ExploreIcon />
          <ButtonGroup>
            {poses.map((pose, index) => (
              <Button key={pose} onClick={() => onClickDirection(pose)}>
                {azimuths[index]}°
              </Button>
            ))}
          </ButtonGroup>
        </Stack>
      </Tooltip>
    </Stack>
  );
};
