import { Button, ButtonGroup, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import type { PoseCameraType } from '@/services/camera.ts';
import { LOADING_ACTION_BUTTON_TIMER_MS } from '@/utils/live.ts';

import { useActionsOnCamera } from '../../context/useActionsOnCamera';

interface PosesButtonsProps {
  cameraId: number;
  poses: PoseCameraType[];
}

export const PosesButtons = ({ cameraId, poses }: PosesButtonsProps) => {
  const [isPoseLoading, setIsPoseLoading] = useState<number | null>(null);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  const { addStreamingAction } = useActionsOnCamera();

  const onClickPose = (patrolId: number) => {
    setIsPoseLoading(patrolId);
    setTimeoutId(
      window.setTimeout(() => {
        setIsPoseLoading(null);
      }, LOADING_ACTION_BUTTON_TIMER_MS)
    );
    addStreamingAction({
      type: 'MOVE_TO_POSE',
      id: cameraId,
      params: { move: { poseId: patrolId } },
    });
  };

  useEffect(() => {
    return () => {
      if (timeoutId != null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
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
            loading={pose.patrol_id == isPoseLoading}
          >
            <Typography p="2px">{pose.azimuth}°</Typography>
          </Button>
        ))}
    </ButtonGroup>
  );
};
