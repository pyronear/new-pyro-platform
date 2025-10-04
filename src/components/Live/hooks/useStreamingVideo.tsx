import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  STATUS_ERROR,
  STATUS_IDLE,
  STATUS_LOADING,
  STATUS_SUCCESS,
} from '@/services/axios';
import {
  moveCameraToAAzimuth,
  startStreaming,
  stopPatrolThenStartStreaming,
  stopStreaming,
  stopStreamingThenStartPatrol,
} from '@/services/live';
import type { ControlledMove } from '@/utils/live';

export interface StreamingAction {
  type: 'START' | 'STOP';
  ip: string;
  hasRotation: boolean;
  initialMove?: ControlledMove;
}

const TIME_BETWEEN_START_AND_MOVE_MS = 3000;

// Hook to prevent the actions start and stop to be run in parallel
export const useStreamingVideo = () => {
  const [streamingQueue, setStreamingQueue] = useState<StreamingAction[]>([]);
  const [isOneActionLoading, setIsOneActionLoading] = useState<boolean>(false);
  const [timer, setTimer] = useState<number | null>(null);

  const { mutateAsync: start, status: statusStart } = useMutation({
    mutationFn: (params: {
      ip: string;
      hasRotation: boolean;
      initialMove?: ControlledMove;
    }) =>
      params.hasRotation
        ? stopPatrolThenStartStreaming(params.ip).then(() => {
            if (params.initialMove) {
              // fix: wait a few seconds before calling for move
              // (problem in the pi)
              setTimer(
                setTimeout(
                  () =>
                    params.initialMove &&
                    moveCameraToAAzimuth(params.ip, params.initialMove),
                  TIME_BETWEEN_START_AND_MOVE_MS
                )
              );
            }
          })
        : startStreaming(params.ip),
  });

  const { mutateAsync: stop, status: statusStop } = useMutation({
    mutationFn: (params: { ip: string; hasRotation: boolean }) =>
      params.hasRotation
        ? stopStreamingThenStartPatrol(params.ip)
        : stopStreaming(),
  });

  const startStreamingVideo = useCallback(
    (ip: string, hasRotation: boolean, initialMove?: ControlledMove) => {
      setStreamingQueue((oldStreamingQueue) => [
        ...oldStreamingQueue,
        { type: 'START', ip, hasRotation, initialMove },
      ]);
    },
    []
  );

  const stopStreamingVideo = useCallback((ip: string, hasRotation: boolean) => {
    setStreamingQueue((oldStreamingQueue) => [
      ...oldStreamingQueue,
      { type: 'STOP', ip, hasRotation },
    ]);
  }, []);

  const removeAction = () => {
    setStreamingQueue((oldStreamingQueue) =>
      oldStreamingQueue.length > 1 ? oldStreamingQueue.slice(1, undefined) : []
    );
  };

  useEffect(() => {
    if (streamingQueue.length > 0 && !isOneActionLoading) {
      const action = streamingQueue[0];
      setIsOneActionLoading(true);

      if (action.type === 'START') {
        void start({
          ip: action.ip,
          hasRotation: action.hasRotation,
          initialMove: action.initialMove,
        }).then(() => {
          setIsOneActionLoading(false);
          removeAction();
        });
      } else {
        void stop({ ip: action.ip, hasRotation: action.hasRotation }).then(
          () => {
            setIsOneActionLoading(false);
            removeAction();
          }
        );
      }
    }
  }, [isOneActionLoading, start, stop, streamingQueue]);

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  const status = useMemo(() => {
    const statusList = [statusStart, statusStop];
    if (
      statusList.every((status) => status == STATUS_SUCCESS) ||
      statusStop == STATUS_IDLE
    ) {
      return STATUS_SUCCESS;
    }
    if (
      statusList.some((status) => status == STATUS_LOADING) ||
      statusStart == STATUS_IDLE
    ) {
      return STATUS_LOADING;
    }
    return STATUS_ERROR;
  }, [statusStart, statusStop]);

  return {
    startStreamingVideo,
    stopStreamingVideo,
    statusStreamingVideo: status,
  };
};
