import L from 'leaflet';

import fireIconUrl from '@/assets/fire-icon.png';
import siteIconUrl from '@/assets/site-icon.png';

export const cameraIcon = new L.Icon({
  iconUrl: siteIconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export const secondaryCameraIcon = L.divIcon({
  className: '',
  html: `<img src="${siteIconUrl}" style="width:24px;height:24px;opacity:0.65;filter:grayscale(1);" />`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

export const fireIcon = new L.Icon({
  iconUrl: fireIconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
