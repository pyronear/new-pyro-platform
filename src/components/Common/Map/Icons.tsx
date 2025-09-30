import L from 'leaflet';

import fireIconUrl from '@/assets/fire-icon.png';
import siteIconUrl from '@/assets/site-icon.png';

export const cameraIcon = new L.Icon({
  iconUrl: siteIconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export const fireIcon = new L.Icon({
  iconUrl: fireIconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
