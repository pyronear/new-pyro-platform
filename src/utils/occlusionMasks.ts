import type { DetectionType } from '../services/alerts';
import type { OcclusionMaskApiType } from '../services/occlusionMasks';

export interface BboxType {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  confidence: number;
}

export const parseApiMask = (mask: string): BboxType | null => {
  const match = /^\(([^)]+)\)$/.exec(mask);
  if (!match) return null;

  const values = match[1].split(',').map((v) => parseFloat(v.trim()));
  if (values.length !== 4 || values.some(isNaN)) return null;

  return {
    xmin: values[0],
    ymin: values[1],
    xmax: values[2],
    ymax: values[3],
    confidence: 0,
  };
};

/**
 * API validates with a regex that only allows 3 decimals
 */
export const formatBboxToApiMask = (bbox: BboxType): string => {
  const round = (v: number) => parseFloat(v.toFixed(3));
  return `(${round(bbox.xmin)},${round(bbox.ymin)},${round(bbox.xmax)},${round(bbox.ymax)})`;
};

/**
 * Parse bboxes string from detection API response
 * The format is like "[(0.508,0.624,0.529,0.651,0)]" - Python-style tuple representation
 */
export const parseBboxes = (bboxesString: string): BboxType[] => {
  try {
    // Remove the outer brackets and parse the tuples
    const cleanString = bboxesString.replace(/^\[|\]$/g, '');

    // Split by tuples - each tuple is wrapped in parentheses
    const tupleMatches = cleanString.match(/\([^)]+\)/g);

    if (!tupleMatches) {
      console.warn('No tuples found in bbox string:', bboxesString);
      return [];
    }

    return tupleMatches
      .map((tupleStr) => {
        // Remove parentheses and split by commas
        const values = tupleStr
          .replace(/^\(|\)$/g, '')
          .split(',')
          .map((val) => parseFloat(val.trim()));

        if (values.length < 5) {
          console.warn('Invalid bbox tuple format:', tupleStr);
          return null;
        }

        return {
          xmin: values[0],
          ymin: values[1],
          xmax: values[2],
          ymax: values[3],
          confidence: values[4],
        };
      })
      .filter((bbox): bbox is BboxType => bbox !== null);
  } catch (error) {
    console.error('Error parsing bboxes:', error, 'Input:', bboxesString);
    return [];
  }
};

/**
 * Find the detection with the highest confidence score in a sequence
 */
export const getHighestConfidenceDetection = (
  detections: DetectionType[]
): DetectionType | null => {
  if (detections.length === 0) return null;

  let highestDetection = detections[0];
  let highestConfidence = -1; // Start with -1 to handle confidence of 0

  detections.forEach((detection) => {
    const bboxes = parseBboxes(detection.bbox);
    bboxes.forEach((bbox) => {
      if (bbox.confidence >= highestConfidence) {
        // Use >= to handle 0 confidence
        highestConfidence = bbox.confidence;
        highestDetection = detection;
      }
    });
  });

  return highestDetection;
};

/**
 * Get the bbox with highest confidence from a detection
 */
export const getHighestConfidenceBbox = (
  detection: DetectionType
): BboxType | null => {
  const bboxes = parseBboxes(detection.bbox);
  if (bboxes.length === 0) {
    return null;
  }

  const highest = bboxes.reduce(
    (highest, current) =>
      current.confidence >= highest.confidence ? current : highest // Use >= to handle 0 confidence
  );
  return highest;
};

/**
 * Enlarge a bbox by a given percentage
 */
export const enlargeBbox = (bbox: BboxType, percentage: number): BboxType => {
  const width = bbox.xmax - bbox.xmin;
  const height = bbox.ymax - bbox.ymin;

  const enlargeWidth = (width * percentage) / 2;
  const enlargeHeight = (height * percentage) / 2;

  return {
    xmin: Math.max(0, bbox.xmin - enlargeWidth),
    ymin: Math.max(0, bbox.ymin - enlargeHeight),
    xmax: Math.min(1, bbox.xmax + enlargeWidth),
    ymax: Math.min(1, bbox.ymax + enlargeHeight),
    confidence: bbox.confidence,
  };
};

/**
 * Check if two bboxes overlap
 */
export const doBboxesOverlap = (bbox1: BboxType, bbox2: BboxType): boolean => {
  return !(
    bbox1.xmax <= bbox2.xmin ||
    bbox2.xmax <= bbox1.xmin ||
    bbox1.ymax <= bbox2.ymin ||
    bbox2.ymax <= bbox1.ymin
  );
};

export const getNonOverlappingMasks = (
  masks: OcclusionMaskApiType[]
): BboxType[] => {
  const sorted = [...masks].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const result: BboxType[] = [];

  sorted.forEach((apiMask) => {
    const bbox = parseApiMask(apiMask.mask);
    if (!bbox) return;

    const overlaps = result.some((existingBbox) =>
      doBboxesOverlap(bbox, existingBbox)
    );

    if (!overlaps) {
      result.push(bbox);
    }
  });

  return result;
};
