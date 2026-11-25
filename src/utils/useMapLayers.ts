import { useMemo } from 'react';

import { usePreferences } from '@/context/usePreferences';
import appConfig from '@/services/appConfig';
import type { BaseLayerType } from '@/services/preferences';

export type { BaseLayerType };

export interface TileLayerConfig {
  url: string;
  attribution: string;
  maxZoom?: number;
  /** Deepest zoom the service actually serves; deeper zooms upscale tiles. */
  maxNativeZoom?: number;
  /** Shallowest zoom the service actually serves; shallower zooms downscale tiles. */
  minNativeZoom?: number;
  /** [[south, west], [north, east]] — no tile is requested outside it. */
  bounds?: [[number, number], [number, number]];
}

/**
 * SCAN 25 Touristique, served only by the private endpoint (JPEG, zoom 6-16).
 *
 * The key is referrer-restricted on the IGN side: every deployed origin must be
 * allow-listed, and requests without a `Referer` are rejected with a 401. Leaflet
 * loads tiles as `<img>`, so the browser default policy sends the origin and that
 * is what IGN matches. Do not set a `referrerPolicy` on the TileLayer, and do not
 * add `Referrer-Policy: no-referrer` (or `same-origin`) to the nginx config —
 * either one strips the header and the layer goes blank.
 */
const buildTopoIgnUrl = (apiKey: string): string =>
  `https://data.geopf.fr/private/wmts?apikey=${apiKey}&SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR&STYLE=normal&FORMAT=image/jpeg&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}`;

const LAYER_CONFIGS: Record<BaseLayerType, TileLayerConfig> = {
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
  },
  ign: {
    url: 'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
    attribution: '&copy; <a href="https://www.ign.fr/">IGN</a>',
    maxZoom: 18,
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution:
      '&copy; <a href="https://www.esri.com/">Esri</a>, Maxar, Earthstar Geographics',
    maxZoom: 19,
  },
  // SCAN 25 Touristique: only served up to zoom 16, deeper zooms upscale.
  // The url is built per-render from the configured key, see useMapLayers.
  topo_ign: {
    url: '',
    attribution:
      '&copy; <a href="https://www.ign.fr/">IGN</a> — SCAN 25&reg;, copie et reproduction interdites',
    maxZoom: 19,
    maxNativeZoom: 16,
  },
};

/** The topo layer is only offered when a key is configured. */
export const isTopoIgnAvailable = (): boolean =>
  !!appConfig.getConfig().IGN_API_KEY;

export const DFCI_LAYER_CONFIG: TileLayerConfig = {
  url: 'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEM.DFCI&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
  attribution: '&copy; <a href="https://www.ign.fr/">IGN</a> DFCI',
  maxZoom: 18,
};

/**
 * BD Forêt® V2: 32 vegetation types, mainland France + Corsica, zoom 6-16.
 * Data was surveyed between 2006 and 2019: it shows the vegetation type, not
 * its current state (no recent burns or clear-cuts).
 */
export const BD_FORET_LAYER_CONFIG: TileLayerConfig = {
  url: 'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=LANDCOVER.FORESTINVENTORY.V2&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM_6_16&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
  attribution:
    '&copy; <a href="https://www.ign.fr/">IGN</a> / Géoplateforme — BD Forêt&reg; V2 (2006–2019)',
  maxZoom: 19,
  minNativeZoom: 6,
  maxNativeZoom: 16,
  bounds: [
    [41.3252, -5.15047],
    [51.0991, 9.57054],
  ],
};

/** Ready-made legend image published by IGN (300×835, French labels). */
export const BD_FORET_LEGEND_URL =
  'https://data.geopf.fr/annexes/ressources/legendes/LANDCOVER.FORESTINVENTORY.V2-legend.png';

export interface WmsLayerConfig {
  url: string;
  layers: string;
  attribution: string;
  format: string;
  transparent: boolean;
  version: string;
}

export const ONF_FOREST_LAYER_CONFIG: WmsLayerConfig = {
  url: 'https://data.geopf.fr/wms-v/ows',
  layers: 'FORETS.PUBLIQUES',
  attribution:
    '&copy; <a href="https://www.onf.fr/">ONF</a> / <a href="https://www.ign.fr/">IGN</a>',
  format: 'image/png',
  transparent: true,
  version: '1.3.0',
};

export const useMapLayers = () => {
  const { preferences, updatePreferences } = usePreferences();

  const baseTileConfig = useMemo(() => {
    const apiKey = appConfig.getConfig().IGN_API_KEY;

    // A stored topo_ign preference is meaningless without a key: fall back.
    if (preferences.map.baseLayer === 'topo_ign') {
      return apiKey
        ? { ...LAYER_CONFIGS.topo_ign, url: buildTopoIgnUrl(apiKey) }
        : LAYER_CONFIGS.ign;
    }

    return LAYER_CONFIGS[preferences.map.baseLayer];
  }, [preferences.map.baseLayer]);

  const updateBaseLayer = (layer: BaseLayerType) => {
    updatePreferences({ map: { baseLayer: layer } });
  };

  return {
    baseLayer: preferences.map.baseLayer,
    baseTileConfig,
    updateBaseLayer,
  };
};
