import { useEffect, useRef } from 'react';

interface UseImagePreloaderParams {
  cacheKey: string | number;
  urls: string[];
  currentIndex: number;
  framesBackward: number;
  framesForward: number;
}

export const useImagePreloader = ({
  cacheKey,
  urls,
  currentIndex,
  framesBackward,
  framesForward,
}: UseImagePreloaderParams): void => {
  const requestedUrls = useRef<Set<string>>(new Set());
  const lastCacheKey = useRef<typeof cacheKey | null>(null);

  useEffect(() => {
    if (lastCacheKey.current !== cacheKey) {
      requestedUrls.current = new Set();
      lastCacheKey.current = cacheKey;
    }
    if (urls.length === 0) {
      return;
    }
    const start = Math.max(0, currentIndex - framesBackward);
    const end = Math.min(urls.length - 1, currentIndex + framesForward);

    for (let i = start; i <= end; i++) {
      const url = urls[i];
      if (!requestedUrls.current.has(url)) {
        const img = new Image();
        img.src = url;
        requestedUrls.current.add(url);
      }
    }
  }, [cacheKey, urls, currentIndex, framesBackward, framesForward]);
};
