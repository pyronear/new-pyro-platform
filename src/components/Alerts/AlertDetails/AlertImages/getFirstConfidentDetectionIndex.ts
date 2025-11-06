import type { DetectionType } from '@/services/alerts';
import { parseBboxes } from '@/utils/occlusionMasks';

const DETECTION_PLAYER_CONFIDENCE_THRESHOLD: number = import.meta.env
  .VITE_DETECTION_PLAYER_CONFIDENCE_THRESHOLD;

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
  const bboxes = parseBboxes(detection.bboxes);
  return bboxes.some(
    (bbox) => bbox.confidence >= DETECTION_PLAYER_CONFIDENCE_THRESHOLD
  );
};
