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
