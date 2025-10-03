import type { BboxType, OcclusionMask } from '../utils/occlusionMasks';
import { getOcclusionMaskKey } from '../utils/occlusionMasks';

/**
 * Get occlusion masks from localStorage for a specific camera and angle of view
 */
export const getOcclusionMasks = (
  cameraName: string,
  angleOfView: number
): OcclusionMask => {
  const key = getOcclusionMaskKey(cameraName, angleOfView);
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
 * Save occlusion masks to localStorage for a specific camera and angle of view
 */
export const saveOcclusionMasks = (
  cameraName: string,
  angleOfView: number,
  masks: OcclusionMask
): void => {
  const key = getOcclusionMaskKey(cameraName, angleOfView);

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
  angleOfView: number,
  bbox: BboxType
): void => {
  const currentMasks = getOcclusionMasks(cameraName, angleOfView);
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

  currentMasks[timestamp] = [
    bbox.xmin,
    bbox.ymin,
    bbox.xmax,
    bbox.ymax,
    bbox.confidence,
  ];

  saveOcclusionMasks(cameraName, angleOfView, currentMasks);
};

/**
 * Clear all occlusion masks for a specific camera and angle of view
 */
export const clearOcclusionMasks = (
  cameraName: string,
  angleOfView: number
): void => {
  saveOcclusionMasks(cameraName, angleOfView, {});
};
