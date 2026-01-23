import { TileLayer } from 'react-leaflet';

import { DFCI_LAYER_CONFIG } from '@/utils/useMapLayers';

interface DfciGridOverlayProps {
  visible: boolean;
}

export const DfciGridOverlay = ({ visible }: DfciGridOverlayProps) => {
  if (!visible) return null;

  return (
    <TileLayer
      url={DFCI_LAYER_CONFIG.url}
      attribution={DFCI_LAYER_CONFIG.attribution}
      opacity={0.7}
    />
  );
};
