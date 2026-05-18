import L, { Map as LeafletMap } from 'leaflet';
import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';

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

const MapSizeInvalidator = () => {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const animationFrameIds = new Set<number>();

    const invalidateMapSize = () => {
      map.invalidateSize({ pan: false });
    };

    const scheduleInvalidateMapSize = () => {
      const animationFrameId = window.requestAnimationFrame(() => {
        animationFrameIds.delete(animationFrameId);
        invalidateMapSize();
      });
      animationFrameIds.add(animationFrameId);
    };

    scheduleInvalidateMapSize();

    if (typeof ResizeObserver === 'undefined') {
      return () => {
        animationFrameIds.forEach((animationFrameId) => {
          window.cancelAnimationFrame(animationFrameId);
        });
      };
    }

    const resizeObserver = new ResizeObserver(scheduleInvalidateMapSize);

    resizeObserver.observe(container);

    return () => {
      animationFrameIds.forEach((animationFrameId) => {
        window.cancelAnimationFrame(animationFrameId);
      });
      resizeObserver.disconnect();
    };
  }, [map]);

  return null;
};

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
      <MapSizeInvalidator />

      {children}

      {showLayerControl && <MapLayerControl />}
    </MapContainer>
  );
};

export default TemplateMap;
