import L, { Map as LeafletMap } from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';

import { useMapLayers } from '@/utils/useMapLayers';

import { MapLayerControl } from './MapLayerControl';

interface CameraMapProps {
  children: React.ReactNode;
  bounds: L.LatLngBounds;
  height?: string;
  minHeight?: string;
  setMapRef?: (map: LeafletMap) => void;
  showLayerControl?: boolean;
}

export const TemplateMap = ({
  height = '100%',
  minHeight,
  children,
  bounds,
  setMapRef,
  showLayerControl = false,
}: CameraMapProps) => {
  const { baseTileConfig } = useMapLayers();

  return (
    <MapContainer
      bounds={bounds}
      key={bounds.toBBoxString()}
      boundsOptions={{ padding: [20, 20] }}
      style={{ height, width: '100%', borderRadius: 4, minHeight }}
      ref={
        (m: LeafletMap) => {
          if (setMapRef) setMapRef(m);
        } // give map ref to parent component
      }
    >
      <TileLayer
        attribution={baseTileConfig.attribution}
        url={baseTileConfig.url}
        maxZoom={baseTileConfig.maxZoom}
      />

      {children}

      {showLayerControl && <MapLayerControl />}
    </MapContainer>
  );
};

export default TemplateMap;
