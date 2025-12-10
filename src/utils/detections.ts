import type { DetectionType } from '@/services/alerts';
import appConfig from '@/services/appConfig';
import { parseBboxes } from '@/utils/occlusionMasks';

const ALERTS_PLAYER_CONFIDENCE_THRESHOLD: number =
  appConfig.getConfig().ALERTS_PLAYER_CONFIDENCE_THRESHOLD;

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
    (bbox) => bbox.confidence >= ALERTS_PLAYER_CONFIDENCE_THRESHOLD
  );
};
