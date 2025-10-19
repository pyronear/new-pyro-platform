import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  STATUS_ERROR,
  STATUS_IDLE,
  STATUS_LOADING,
  STATUS_SUCCESS,
} from '@/services/axios';
import {
  moveCamera,
  moveCameraToAAzimuth,
  startStreaming,
  stopCamera,
  stopPatrolThenStartStreaming,
  stopStreaming,
  stopStreamingThenStartPatrol,
  zoomCamera,
} from '@/services/live';
import type { MovementCommand } from '@/utils/live';
import { useTranslationPrefix } from '@/utils/useTranslationPrefix';

import {
  ActionsOnCameraContext,
  type StreamingAction,
} from '../context/ActionsOnCameraContext';

const TIME_BETWEEN_START_AND_MOVE_MS = 3000;
const LIVE_STREAMING_TIMEOUT_MS =
  import.meta.env.VITE_LIVE_STREAMING_TIMEOUT_SECONDS * 1000;

// Hook to prevent the actions start and stop, movements to be run in parallel
// And orchestrate actions on camera
export const ActionsOnCameraContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [actionsQueue, setActionsQueue] = useState<StreamingAction[]>([]);
  const [errorOnAction, setErrorOnAction] = useState<string | null>(null);
  const [isOneActionLoading, setIsOneActionLoading] = useState<boolean>(false);
  // After a duration without any action, the streaming will be automatically stopped (timeout)
  const [isStreamingTimeout, setIsStreamingTimeout] = useState<boolean>(false);
  const [timerStreaming, setTimerStreaming] = useState<number | null>();
  const [timerBeforeInitialMove, setTimerBeforeInitialMove] = useState<
    number | null
  >(null);
  const { t } = useTranslationPrefix('live');

  const { mutateAsync: startStreamingMutate, status: statusStart } =
    useMutation({
      mutationFn: (params: {
        ip: string;
        hasRotation: boolean;
        initialMove?: MovementCommand;
      }) =>
        params.hasRotation
          ? stopPatrolThenStartStreaming(params.ip).then(() => {
              if (params.initialMove) {
                // fix: wait a few seconds before calling for move
                // (problem in the pi)
                setTimerBeforeInitialMove(
                  window.setTimeout(
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

  const { mutateAsync: stopStreamingMutate, status: statusStop } = useMutation({
    mutationFn: (params: { ip: string; hasRotation: boolean }) =>
      params.hasRotation
        ? stopStreamingThenStartPatrol(params.ip)
        : stopStreaming(),
  });

  const addActionToQueue = useCallback((newAction: StreamingAction) => {
    setActionsQueue((oldStreamingQueue) => [...oldStreamingQueue, newAction]);
  }, []);

  const popFirstActionInQueue = useCallback(() => {
    setActionsQueue((oldStreamingQueue) =>
      oldStreamingQueue.length > 1 ? oldStreamingQueue.slice(1, undefined) : []
    );
  }, []);

  const resetErrorOnAction = useCallback(() => {
    setErrorOnAction(null);
  }, []);

  const resetTimerForStreaming = useCallback(() => {
    setIsStreamingTimeout(false);
    setTimerStreaming(
      window.setTimeout(() => {
        setIsStreamingTimeout(true);
      }, LIVE_STREAMING_TIMEOUT_MS)
    );
  }, []);

  const asyncCallByAction = useCallback(
    (action: StreamingAction) => {
      switch (action.type) {
        case 'START_STREAMING':
          return startStreamingMutate({
            ip: action.ip,
            hasRotation: action.params.hasRotation ?? false,
            initialMove: action.params.move,
          });
        case 'STOP_STREAMING':
          return stopStreamingMutate({
            ip: action.ip,
            hasRotation: action.params.hasRotation ?? false,
          });
        case 'MOVE':
          return moveCamera(
            action.ip,
            action.params.move?.direction,
            action.params.move?.speed,
            action.params.move?.poseId,
            action.params.move?.degrees
          );
        case 'MOVE_TO_AZIMUTH':
          if (action.params.move != undefined) {
            return moveCameraToAAzimuth(action.ip, action.params.move);
          }
          return Promise.resolve();
        case 'STOP':
          return stopCamera(action.ip);
        case 'ZOOM':
          if (action.params.zoom != undefined) {
            return zoomCamera(action.ip, action.params.zoom);
          }
          return Promise.resolve();
      }
    },
    [startStreamingMutate, stopStreamingMutate]
  );

  // Consumer for actions in the queue
  useEffect(() => {
    if (actionsQueue.length > 0 && !isOneActionLoading) {
      const action = actionsQueue[0]; // First in, first out
      setIsOneActionLoading(true);
      asyncCallByAction(action)
        .catch(() => {
          setErrorOnAction(t('errorOnActionStreaming'));
        })
        .finally(() => {
          setIsOneActionLoading(false);
          popFirstActionInQueue();
          resetTimerForStreaming();
        });
    }
  }, [
    asyncCallByAction,
    isOneActionLoading,
    resetTimerForStreaming,
    actionsQueue,
    t,
    popFirstActionInQueue,
  ]);

  useEffect(() => {
    return () => {
      if (timerStreaming) {
        clearTimeout(timerStreaming);
      }
    };
  }, [timerStreaming]);

  useEffect(() => {
    return () => {
      if (timerBeforeInitialMove) {
        clearTimeout(timerBeforeInitialMove);
      }
    };
  }, [timerBeforeInitialMove]);

  const statusStreamingVideo = useMemo(() => {
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

  const contextValue = useMemo(
    () => ({
      addStreamingAction: addActionToQueue,
      isStreamingTimeout,
      resetErrorOnAction,
      errorStreamingAction: errorOnAction,
      statusStreamingVideo,
    }),
    [
      addActionToQueue,
      isStreamingTimeout,
      resetErrorOnAction,
      errorOnAction,
      statusStreamingVideo,
    ]
  );

  return (
    <ActionsOnCameraContext value={contextValue}>
      {children}
    </ActionsOnCameraContext>
  );
};
