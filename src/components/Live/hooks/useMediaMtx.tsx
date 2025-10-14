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
  ip: string;
}

export const StateStreaming = {
  IN_CREATION: 0, // StartStreaming command launched, waiting for the data to arrive to the broadcast url
  IS_STREAMING: 1, // The reader is broadcasting data
  WITH_ERROR: 2, // Temporary failure in broadcasting data
  STOPPED: 3, // The reader has failed and will not try again de connect the broadcast url
};

export const useMediaMtx = ({
  urlStreaming,
  refVideo,
  ip,
}: StreamVideoProps) => {
  const [state, setState] = useState<number>(StateStreaming.IN_CREATION);

  const reader = useMemo(() => {
    if (urlStreaming) {
      return new MediaMTXWebRTCReader({
        url: urlStreaming,
        onError: (err: string) => {
          console.log(err);
          setState((oldValue) =>
            // Set to error state only if the video is initialized
            oldValue === StateStreaming.IS_STREAMING
              ? StateStreaming.WITH_ERROR
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
          setState(StateStreaming.STOPPED);
        },
      });
    } else {
      return null;
    }
  }, [refVideo, urlStreaming]);

  const restart = useCallback(() => {
    setState(StateStreaming.IN_CREATION);
    reader?.start();
  }, [reader]);

  useEffect(() => {
    // Clean up reader
    if (reader && ip) {
      setState(StateStreaming.IN_CREATION);
      reader.start();
    }
    return () => {
      if (reader && ip) {
        setState(StateStreaming.STOPPED);
        reader.close();
      }
    };
  }, [reader, ip]);

  return { state, restart };
};
