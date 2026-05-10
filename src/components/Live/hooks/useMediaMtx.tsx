import {
  type RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { MediaMTXWebRTCReader } from './reader';

interface StreamVideoProps {
  urlStreaming: string;
  refVideo: RefObject<HTMLVideoElement | null>;
  id: number;
}

export const StateStreaming = {
  IN_CREATION: 0, // StartStreaming command launched, waiting for the data to arrive to the broadcast url
  IS_STREAMING: 1, // The reader is broadcasting data
  TEMPORARY_ERROR: 2, // Temporary failure in broadcasting data
  FAILED: 3, // The reader has failed loading and will not try again de connect the broadcast url
  STOPPED: 4, // The reader is stopped and will not try again de connect the broadcast url
};

const INITIAL_STATE = StateStreaming.IN_CREATION;

export const useMediaMtx = ({
  urlStreaming,
  refVideo,
  id,
}: StreamVideoProps) => {
  const [state, setState] = useState<number>(INITIAL_STATE);

  const reader = useMemo(() => {
    if (urlStreaming) {
      return new MediaMTXWebRTCReader({
        url: urlStreaming,
        onError: (err: string) => {
          console.log(err);
          setState((oldValue) =>
            // Set to error state only if the video is initialized
            oldValue === StateStreaming.IS_STREAMING
              ? StateStreaming.TEMPORARY_ERROR
              : oldValue
          );
        },
        onTrack: (evt: RTCTrackEvent) => {
          // Signal from streaming is etablished
          setState(StateStreaming.IS_STREAMING);
          if (refVideo.current) {
            refVideo.current.srcObject = evt.streams[0];
          }
        },
        onFailLoading: () => {
          console.error('failed loading stream');
          setState(StateStreaming.FAILED);
        },
      });
    } else {
      return null;
    }
  }, [refVideo, urlStreaming]);

  const start = useCallback(() => {
    setState(INITIAL_STATE);
    if (reader) {
      reader.start();
    }
  }, [reader]);

  useEffect(() => {
    // Clean up reader
    if (reader && id) {
      setState(INITIAL_STATE);
      reader.start();
    }
    return () => {
      if (reader && id) {
        setState(StateStreaming.STOPPED);
        reader.close();
      }
    };
  }, [reader, id]);

  return { state, restart: start };
};
