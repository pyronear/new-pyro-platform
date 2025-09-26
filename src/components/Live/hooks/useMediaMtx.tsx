import { type RefObject, useEffect, useMemo, useState } from 'react';

import { MediaMTXWebRTCReader } from './reader';

interface StreamVideoProps {
  urlStreaming: string;
  refVideo: RefObject<HTMLVideoElement | null>;
  ip: string;
}

export const useMediaMtx = ({
  urlStreaming,
  refVideo,
  ip,
}: StreamVideoProps) => {
  // This boolean prevents from displaying error as long as the stream has no started yet
  const [isInitialized, setIsInitialized] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [hasError, setHasError] = useState(false);

  const reader = useMemo(() => {
    if (urlStreaming) {
      return new MediaMTXWebRTCReader({
        url: urlStreaming,
        onError: (err: string) => {
          console.log(err);
          setHasError(true);
        },
        onTrack: (evt: RTCTrackEvent) => {
          // Signal from streaming is etablished
          setIsInitialized(true);
          setHasError(false);
          if (refVideo.current) {
            refVideo.current.srcObject = evt.streams[0];
          }
        },
        onFailLoading: () => {
          setIsStopped(true);
        },
      });
    } else {
      return null;
    }
  }, [refVideo, urlStreaming]);

  useEffect(() => {
    // Clean up video state
    return () => {
      if (ip) {
        setIsInitialized(false);
        setHasError(false);
      }
    };
  }, [ip]);

  useEffect(() => {
    // Clean up reader
    if (reader) {
      reader.start();
    }
    return () => {
      if (reader) {
        reader.close();
      }
    };
  }, [reader]);

  return { isInitialized, hasError, isStopped };
};
