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

// Leaflet computes the map size only when its container mounts. If the container
// is later resized (fullscreen toggle, responsive layout, panel open/close), Leaflet
// keeps the stale size and leaves blank/grey areas where tiles are missing.
// This component calls map.invalidateSize() on mount and on every container resize
// so Leaflet recomputes its size and loads the missing tiles.
const MapSizeInvalidator = () => {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    // Tracks scheduled-but-not-yet-run frames so we can cancel them on unmount
    // and never call invalidateSize on a destroyed map.
    const animationFrameIds = new Set<number>();

    const invalidateMapSize = () => {
      map.invalidateSize({ pan: false });
    };

    // Defer the invalidate to the next frame, after the browser has finished
    // its layout, so we read the container's final dimensions.
    const scheduleInvalidateMapSize = () => {
      const animationFrameId = window.requestAnimationFrame(() => {
        animationFrameIds.delete(animationFrameId);
        invalidateMapSize();
      });
      animationFrameIds.add(animationFrameId);
    };

    scheduleInvalidateMapSize();

    // Fallback for environments without ResizeObserver (e.g. jsdom in tests):
    // no resize tracking, just cancel any pending frame on unmount.
    if (typeof ResizeObserver === 'undefined') {
      return () => {
        animationFrameIds.forEach((animationFrameId) => {
          window.cancelAnimationFrame(animationFrameId);
        });
      };
    }

    // Re-invalidate whenever the container's size changes.
    const resizeObserver = new ResizeObserver(scheduleInvalidateMapSize);

    resizeObserver.observe(container);

    // Cancel pending frames first, then stop observing — order matters so no
    // queued frame can fire invalidateSize after the map is torn down.
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
