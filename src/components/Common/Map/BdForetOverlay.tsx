import { TileLayer } from 'react-leaflet';

import { BD_FORET_LAYER_CONFIG } from '@/utils/useMapLayers';

interface BdForetOverlayProps {
  visible: boolean;
}

export const BdForetOverlay = ({ visible }: BdForetOverlayProps) => {
  if (!visible) return null;

  return (
    <TileLayer
      url={BD_FORET_LAYER_CONFIG.url}
      attribution={BD_FORET_LAYER_CONFIG.attribution}
      opacity={0.6}
      maxZoom={BD_FORET_LAYER_CONFIG.maxZoom}
      minNativeZoom={BD_FORET_LAYER_CONFIG.minNativeZoom}
      maxNativeZoom={BD_FORET_LAYER_CONFIG.maxNativeZoom}
      bounds={BD_FORET_LAYER_CONFIG.bounds}
    />
  );
};
