import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';
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
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { autofocus, capture } from '@/services/live.ts';
import type { CameraFullInfosType } from '@/utils/camera.ts';
import { dateNowFormattedForFilename } from '@/utils/dates.ts';
import { getMoveToAzimuth, isAzimuthValid } from '@/utils/live';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { useActionsOnCamera } from '../../context/useActionsOnCamera';

interface QuickActionsProps {
  camera: CameraFullInfosType;
  speedName: number;
  nextSpeed: () => void;
}

export const QuickActions = ({
  camera,
  speedName,
  nextSpeed,
}: QuickActionsProps) => {
  const theme = useTheme();
  const { t } = useTranslationPrefix('live');
  const { addStreamingAction } = useActionsOnCamera();
  const [azimuthToGo, setAzimuthToGo] = useState<string>('');
  const isAzimuthToGoInvalid = !isAzimuthValid(azimuthToGo);
  const cameraId = camera.id;
  const poses = camera.poses ?? [];

  const onClickDirection = (pose: number) => {
    addStreamingAction({
      type: 'MOVE',
      id: cameraId,
      params: { move: { poseId: pose } },
    });
  };

  const onClickAzimuth = () => {
    const azimuthToGoInt = Number(azimuthToGo);
    if (!Number.isNaN(azimuthToGoInt)) {
      const move = getMoveToAzimuth(azimuthToGoInt, poses) ?? undefined;
      addStreamingAction({
        type: 'MOVE_TO_AZIMUTH',
        id: cameraId,
        params: { move },
      });
    }
  };

  const captureAndDownload = () => {
    return capture(cameraId).then((url) => {
      console.log(url);
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        const filename = `screenshot_${camera.name}_${dateNowFormattedForFilename()}.jpeg`;
        link.setAttribute('download', filename);

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link and the url
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    });
  };

  const { mutate: onClickCapture, isPending: isCaptureInProgess } = useMutation(
    {
      mutationFn: () => captureAndDownload(),
    }
  );

  const { mutate: onClickAutofocus, isPending: isAutoFocusInProgess } =
    useMutation({
      mutationFn: () => autofocus(cameraId),
    });

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

      <Stack direction="row" spacing={2} alignItems="center">
        <ExploreOutlinedIcon />
        <Tooltip title={t('tooltipPrerecordedAzimuths')}>
          <ButtonGroup>
            {poses
              .filter((pose) => pose.patrol_id != null)
              .sort((p1, p2) => (p1.patrol_id ?? 0) - (p2.patrol_id ?? 0))
              .map((pose) => (
                <Button
                  key={pose.id}
                  onClick={() =>
                    pose.patrol_id != null && onClickDirection(pose.patrol_id)
                  }
                >
                  <Typography p="2px">{pose.azimuth}°</Typography>
                </Button>
              ))}
          </ButtonGroup>
        </Tooltip>
        <Tooltip title={t('tooltipCustomAzimuths')}>
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
      <Tooltip title={t('tooltipAutofocus')}>
        <IconButton
          color="primary"
          onClick={() => onClickAutofocus()}
          loading={isAutoFocusInProgess}
        >
          <AutoAwesomeIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('tooltipScreenshot')}>
        <IconButton
          color="primary"
          onClick={() => onClickCapture()}
          loading={isCaptureInProgess}
        >
          <CameraEnhanceIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};
