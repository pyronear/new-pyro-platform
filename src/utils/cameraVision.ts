import type { LatLng } from 'leaflet';

const degreesToRadians = (degrees: number): number => degrees * (Math.PI / 180);

const radiansToDegrees = (radians: number): number => radians * (180 / Math.PI);

/**
 * Calculate destination point given a starting point, bearing and distance
 * Based on the geodesic calculations similar to geopy.distance.geodesic
 */
const destinationPoint = (
  lat: number,
  lon: number,
  bearing: number,
  distanceKm: number
): LatLng => {
  const R = 6371; // Earth's radius in kilometers
  const φ1 = degreesToRadians(lat);
  const λ1 = degreesToRadians(lon);
  const bearingRad = degreesToRadians(bearing);
  const δ = distanceKm / R;

  const φ2 = Math.asin(
    Math.sin(φ1) * Math.cos(δ) +
      Math.cos(φ1) * Math.sin(δ) * Math.cos(bearingRad)
  );
  const λ2 =
    λ1 +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(δ) * Math.cos(φ1),
      Math.cos(δ) - Math.sin(φ1) * Math.sin(φ2)
    );

  return {
    lat: radiansToDegrees(φ2),
    lng: radiansToDegrees(λ2),
  } as LatLng;
};

/**
 * Build a vision polygon for a camera
 * @param siteLat - Latitude of the camera
 * @param siteLon - Longitude of the camera
 * @param azimuth - Central direction of the camera in degrees
 * @param openingAngle - Field of view in degrees
 * @param distKm - Distance to project the polygon edges in kilometers
 * @returns Array of LatLng points representing the vision cone
 */
export const buildVisionPolygon = (
  siteLat: number,
  siteLon: number,
  azimuth: number,
  openingAngle: number,
  distKm: number
): LatLng[] => {
  const center: LatLng = { lat: siteLat, lng: siteLon } as LatLng;

  const nSteps = Math.max(1, Math.round(openingAngle));

  const points1: LatLng[] = [];
  const points2: LatLng[] = [];

  for (let i = nSteps; i >= 1; i--) {
    const azimuth1 = (azimuth - i / 2) % 360;
    const azimuth2 = (azimuth + i / 2) % 360;

    const point1 = destinationPoint(siteLat, siteLon, azimuth1, distKm);
    const point2 = destinationPoint(siteLat, siteLon, azimuth2, distKm);

    points1.push(point1);
    points2.push(point2);
  }

  const points = [center, ...points1, ...points2.reverse()];

  return points;
};

export const DEFAULT_CAM_RANGE_KM =
  Number(import.meta.env.VITE_DEFAULT_CAM_RANGE_KM) || 30;
