import type { DetectionType } from './alerts';

export type OcclusionMask = Record<string, number[]>; // [xmin, ymin, xmax, ymax, confidence]

export interface BboxType {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  confidence: number;
}

/**
 * Get the camera prefix name from the camera name
 * Example: "nemours-01" -> "nemours"
 */
export const getCameraPrefixName = (cameraName: string): string => {
  const lastDashIndex = cameraName.lastIndexOf('-');
  if (lastDashIndex === -1) {
    return cameraName;
  }
  return cameraName.substring(0, lastDashIndex);
};

/**
 * Generate the occlusion mask file key for localStorage
 * Format: "CAMERA_PREFIX_NAME" + "_" + "CAMERA_POSITION_AZIMUTH"
 */
export const getOcclusionMaskKey = (
  cameraName: string,
  azimuth: number
): string => {
  const prefixName = getCameraPrefixName(cameraName);
  return `${prefixName}_${azimuth}`;
};

/**
 * Get occlusion masks from localStorage for a specific camera and azimuth
 */
export const getOcclusionMasks = (
  cameraName: string,
  azimuth: number
): OcclusionMask => {
  const key = getOcclusionMaskKey(cameraName, azimuth);
  const stored = localStorage.getItem(`occlusion_mask_${key}`);

  if (!stored) {
    return {};
  }

  try {
    const masks = JSON.parse(stored) as OcclusionMask;

    // Filter out masks older than 120 days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 120);

    const filteredMasks: OcclusionMask = {};
    Object.entries(masks).forEach(([timestamp, bbox]) => {
      const maskDate = new Date(timestamp);
      if (maskDate >= cutoffDate) {
        filteredMasks[timestamp] = bbox;
      }
    });

    return filteredMasks;
  } catch (error) {
    console.error('Error parsing occlusion masks from localStorage:', error);
    return {};
  }
};

/**
 * Save occlusion masks to localStorage for a specific camera and azimuth
 */
export const saveOcclusionMasks = (
  cameraName: string,
  azimuth: number,
  masks: OcclusionMask
): void => {
  const key = getOcclusionMaskKey(cameraName, azimuth);

  try {
    localStorage.setItem(`occlusion_mask_${key}`, JSON.stringify(masks));
  } catch (error) {
    console.error('Error saving occlusion masks to localStorage:', error);
  }
};

/**
 * Add a new occlusion mask
 */
export const addOcclusionMask = (
  cameraName: string,
  azimuth: number,
  bbox: BboxType
): void => {
  const currentMasks = getOcclusionMasks(cameraName, azimuth);
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  currentMasks[timestamp] = [
    bbox.xmin,
    bbox.ymin,
    bbox.xmax,
    bbox.ymax,
    bbox.confidence,
  ];

  saveOcclusionMasks(cameraName, azimuth, currentMasks);
};

/**
 * Clear all occlusion masks for a specific camera and azimuth
 */
export const clearOcclusionMasks = (
  cameraName: string,
  azimuth: number
): void => {
  saveOcclusionMasks(cameraName, azimuth, {});
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
    const bboxes = parseBboxes(detection.bboxes);
    bboxes.forEach((bbox) => {
      console.log('bbox confidence:', bbox.confidence);
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
  const bboxes = parseBboxes(detection.bboxes);
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

/**
 * Get non-overlapping occlusion masks (most recent takes precedence)
 */
export const getNonOverlappingMasks = (masks: OcclusionMask): BboxType[] => {
  const maskEntries = Object.entries(masks).sort(
    ([timestampA], [timestampB]) =>
      new Date(timestampB).getTime() - new Date(timestampA).getTime()
  );

  const result: BboxType[] = [];

  maskEntries.forEach(([, bboxArray]) => {
    const bbox: BboxType = {
      xmin: bboxArray[0],
      ymin: bboxArray[1],
      xmax: bboxArray[2],
      ymax: bboxArray[3],
      confidence: bboxArray[4],
    };

    const overlaps = result.some((existingBbox) =>
      doBboxesOverlap(bbox, existingBbox)
    );

    if (!overlaps) {
      result.push(bbox);
    }
  });

  return result;
};
