import { WMSTileLayer } from 'react-leaflet';

import { ONF_FOREST_LAYER_CONFIG } from '@/utils/useMapLayers';

interface OnfForestOverlayProps {
  visible: boolean;
}

export const OnfForestOverlay = ({ visible }: OnfForestOverlayProps) => {
  if (!visible) return null;

  return (
    <WMSTileLayer
      url={ONF_FOREST_LAYER_CONFIG.url}
      layers={ONF_FOREST_LAYER_CONFIG.layers}
      attribution={ONF_FOREST_LAYER_CONFIG.attribution}
      format={ONF_FOREST_LAYER_CONFIG.format}
      transparent={ONF_FOREST_LAYER_CONFIG.transparent}
      version={ONF_FOREST_LAYER_CONFIG.version}
      opacity={0.6}
      maxZoom={19}
      maxNativeZoom={18}
    />
  );
};
