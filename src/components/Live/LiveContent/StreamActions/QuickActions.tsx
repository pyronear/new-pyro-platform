import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CameraEnhanceIcon from '@mui/icons-material/CameraEnhance';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import GamepadIcon from '@mui/icons-material/Gamepad';
import { Collapse, Divider, IconButton, Stack, Tooltip } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { CustomAzimuthField } from '@/components/Live/LiveContent/StreamActions/CustomAzimuthField.tsx';
import { PosesButtons } from '@/components/Live/LiveContent/StreamActions/PosesButtons.tsx';
import { capture, zoomCamera } from '@/services/live.ts';
import type { CameraFullInfosType } from '@/utils/camera.ts';
import { dateNowFormattedForFilename } from '@/utils/dates.ts';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

interface QuickActionsProps {
  hasRotation: boolean;
  camera: CameraFullInfosType;
  zoom: number;
  handleHelper: () => void;
}

export const QuickActions = ({
  hasRotation,
  camera,
  zoom,
  handleHelper,
}: QuickActionsProps) => {
  const { t } = useTranslationPrefix('live');
  const [displayPoses, setDisplayPoses] = useState<boolean>(true);

  const cameraId = camera.id;
  const poses = camera.poses ?? [];

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
        <IconButton color="primary" onClick={handleHelper}>
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
                <PosesButtons cameraId={cameraId} poses={poses} />
              </Tooltip>
              <Tooltip title={t('tooltipCustomAzimuths')}>
                <CustomAzimuthField cameraId={cameraId} poses={poses} />
              </Tooltip>
            </Stack>
          </Collapse>
        </Stack>
      )}
    </Stack>
  );
};
