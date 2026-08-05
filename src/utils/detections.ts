import type { DetectionType } from '@/services/alerts';
import appConfig from '@/services/appConfig';
import { parseBboxes } from '@/utils/occlusionMasks';

const ALERTS_PLAYER_CONFIDENCE_THRESHOLD: number =
  appConfig.getConfig().ALERTS_PLAYER_CONFIDENCE_THRESHOLD;

const DEFAULT_PAGE_SIZE = appConfig.getConfig().ALERTS_PLAYER_BUFFER_SIZE;

export interface BoundingBox {
  left: string;
  top: string;
  width: string;
  height: string;
}

export const getFirstConfidentDetectionIndex = (
  detections: DetectionType[]
): number => {
  const firstDetectionIndex = detections.findIndex((detection) =>
    hasBboxWithSufficientConfidence(detection)
  );
  const prevIndex = firstDetectionIndex - 1;

  return prevIndex >= 0 ? prevIndex : 0;
};

const hasBboxWithSufficientConfidence = (detection: DetectionType): boolean => {
  const bboxes = parseBboxes(detection.bbox);
  return bboxes.some(
    (bbox) => bbox.confidence >= ALERTS_PLAYER_CONFIDENCE_THRESHOLD
  );
};

export const parseBboxCoords = (
  bbox: string
): { x1: number; y1: number; x2: number; y2: number } | null => {
  const match = /\(([^)]+)\)/.exec(bbox);
  if (!match) {
    return null;
  }
  const [x1, y1, x2, y2] = match[1].split(',').map(parseFloat);
  return { x1, y1, x2, y2 };
};

export const parseDetectionBox = (
  detection: DetectionType | null
): BoundingBox | null => {
  if (detection === null) {
    return null;
  }

  const coords = parseBboxCoords(detection.bbox);
  if (!coords) {
    return null;
  }

  const { x1, y1, x2, y2 } = coords;
  return {
    left: `${100 * x1}%`,
    top: `${100 * y1}%`,
    width: `${100 * (x2 - x1)}%`,
    height: `${100 * (y2 - y1)}%`,
  };
};

export const calculateDetectionsPages = (detectionsCount: number): Page[] => {
  const pages: Page[] = [];
  if (!detectionsCount) {
    return pages;
  }
  // Add the first N detections
  const limitFirstPage = Math.min(DEFAULT_PAGE_SIZE, detectionsCount);
  pages.push({
    offset: 0,
    limit: limitFirstPage,
    sampling: 1,
  });
  const hasOnlyOnePage = detectionsCount <= DEFAULT_PAGE_SIZE;
  if (hasOnlyOnePage) {
    return pages;
  }

  // Add the last N detections
  const offsetOtherPage = Math.max(
    limitFirstPage,
    detectionsCount - DEFAULT_PAGE_SIZE
  );
  pages.push({
    offset: offsetOtherPage,
    limit: detectionsCount,
    sampling: 1,
  });
  if (limitFirstPage != offsetOtherPage) {
    // Add the N detections in the middle
    const detectionsInTheMiddle = offsetOtherPage - limitFirstPage;
    pages.push({
      offset: limitFirstPage,
      limit: offsetOtherPage,
      sampling:
        detectionsInTheMiddle <= DEFAULT_PAGE_SIZE
          ? 1
          : Math.ceil(detectionsInTheMiddle / DEFAULT_PAGE_SIZE),
    });
  }

  return pages.sort((a, b) => a.offset - b.offset);
};

export const calculateNbDetectionsToLoad = (pages: Page[]) => {
  let count = 0;
  if (pages.length == 0) {
    return count;
  }
  count += pages[0].limit;
  return count;
};

export interface Page {
  offset: number;
  limit: number;
  sampling: number;
}
