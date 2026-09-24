import type { DetectionType } from '@/services/alerts';
import appConfig from '@/services/appConfig';
import { parseBboxes } from '@/utils/occlusionMasks';

const ALERTS_PLAYER_CONFIDENCE_THRESHOLD: number =
  appConfig.getConfig().ALERTS_PLAYER_CONFIDENCE_THRESHOLD;

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

// Round away the float noise from subtracting coords (e.g. 0.4 - 0.2) so the
// resulting CSS percentages are clean.
const toPercent = (ratio: number): string =>
  `${parseFloat((100 * ratio).toFixed(3))}%`;

const toBoundingBox = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): BoundingBox => ({
  left: toPercent(x1),
  top: toPercent(y1),
  width: toPercent(x2 - x1),
  height: toPercent(y2 - y1),
});

export const parseMainDetectionBox = (
  detection: DetectionType | null
): BoundingBox | null => {
  if (detection === null) {
    return null;
  }

  const coords = parseBboxCoords(detection.bbox);
  if (!coords) {
    return null;
  }

  return toBoundingBox(coords.x1, coords.y1, coords.x2, coords.y2);
};

export const parseOtherDetectionBoxes = (
  detection: DetectionType | null
): BoundingBox[] | null => {
  if (detection?.others_bboxes == null) {
    return null;
  }

  return parseBboxes(detection.others_bboxes).map(
    ({ xmin, ymin, xmax, ymax }) => toBoundingBox(xmin, ymin, xmax, ymax)
  );
};

export const calculateDetectionsPages = (
  detectionsCount: number,
  pageSize: number
): Page[] => {
  const pages: Page[] = [];
  if (!detectionsCount) {
    return pages;
  }
  // Add the first N detections
  const limitFirstPage = Math.min(pageSize, detectionsCount);
  pages.push({
    limit: limitFirstPage,
    sampling: 1,
    desc: false,
  });
  if (detectionsCount > 2 * pageSize) {
    // Add the N detections in the middle
    const detectionsInTheMiddle = detectionsCount - 2 * pageSize;

    pages.push({
      offset: limitFirstPage,
      limit: Math.min(detectionsInTheMiddle, pageSize),
      sampling: Math.ceil(detectionsInTheMiddle / pageSize),
      desc: false,
    });
  }

  if (detectionsCount > pageSize) {
    // Add the last N detections
    const limitLastPage = Math.min(detectionsCount - pageSize, pageSize);
    pages.push({
      limit: limitLastPage,
      sampling: 1,
      desc: true,
    });
  }

  return pages;
};

export const calculateNbDetectionsToLoad = (pages: Page[]) => {
  return pages.reduce((count, page) => count + page.limit, 0);
};

export interface Page {
  offset?: number;
  limit: number;
  sampling: number;
  desc: boolean;
}
