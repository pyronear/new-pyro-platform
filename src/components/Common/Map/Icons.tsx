import L from 'leaflet';

import siteIcon from '@/assets/site-icon.png';

export const cameraIcon = new L.Icon({
  iconUrl: siteIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});
