import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import GamepadIcon from '@mui/icons-material/Gamepad';
import SearchIcon from '@mui/icons-material/Search';
import {
  Button,
  ButtonGroup,
  Collapse,
  Divider,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { capture, zoomCamera } from '@/services/live.ts';
import type { CameraFullInfosType } from '@/utils/camera.ts';
import { dateNowFormattedForFilename } from '@/utils/dates.ts';
import { getMoveToAzimuth, isAzimuthValid } from '@/utils/live';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import { useActionsOnCamera } from '../../context/useActionsOnCamera';

interface QuickActionsProps {
  hasRotation: boolean;
  camera: CameraFullInfosType;
  zoom: number;
  handleOpenHelper: () => void;
}

export const QuickActions = ({
  hasRotation,
  camera,
  zoom,
  handleOpenHelper,
}: QuickActionsProps) => {
  const { t } = useTranslationPrefix('live');
  const { addStreamingAction } = useActionsOnCamera();
  const [displayPoses, setDisplayPoses] = useState<boolean>(true);
  const [azimuthToGo, setAzimuthToGo] = useState<string>('');
  const isAzimuthToGoInvalid = !isAzimuthValid(azimuthToGo);
  const cameraId = camera.id;
  const poses = camera.poses ?? [];

  const onClickPose = (pose: number) => {
    addStreamingAction({
      type: 'MOVE_TO_POSE',
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
      mutationFn: () => zoomCamera(cameraId, zoom),
    });

  return (
    <Stack
      divider={<Divider flexItem orientation="vertical" />}
      direction="row"
      spacing={2}
      sx={{
        paddingY: 1,
        paddingX: 2,
      }}
    >
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
      {hasRotation && (
        <IconButton color="primary" onClick={handleOpenHelper}>
          <GamepadIcon />
        </IconButton>
      )}
      {hasRotation && (
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            color="primary"
            onClick={() => setDisplayPoses((old) => !old)}
          >
            <ExploreOutlinedIcon color="primary" />
          </IconButton>
          <Collapse orientation="horizontal" in={displayPoses}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Tooltip title={t('tooltipPrerecordedAzimuths')}>
                <ButtonGroup>
                  {poses
                    .filter((pose) => pose.patrol_id != null)
                    .sort((p1, p2) => (p1.patrol_id ?? 0) - (p2.patrol_id ?? 0))
                    .map((pose) => (
                      <Button
                        key={pose.id}
                        onClick={() =>
                          pose.patrol_id != null && onClickPose(pose.patrol_id)
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
          </Collapse>
        </Stack>
      )}
    </Stack>
  );
};
