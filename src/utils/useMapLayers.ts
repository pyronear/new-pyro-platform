import { useMemo } from 'react';

import { usePreferences } from '@/context/usePreferences';

export interface TileLayerConfig {
  url: string;
  attribution: string;
  maxZoom?: number;
}

export type BaseLayerType = 'osm' | 'ign' | 'satellite';

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
};

export const DFCI_LAYER_CONFIG: TileLayerConfig = {
  url: 'https://data.geopf.fr/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEM.DFCI&STYLE=normal&FORMAT=image/png&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}',
  attribution: '&copy; <a href="https://www.ign.fr/">IGN</a> DFCI',
  maxZoom: 18,
};

export const useMapLayers = () => {
  const { preferences, updatePreferences } = usePreferences();

  const baseTileConfig = useMemo(
    () => LAYER_CONFIGS[preferences.map.baseLayer],
    [preferences.map.baseLayer]
  );

  const updateBaseLayer = (layer: BaseLayerType) => {
    updatePreferences({ map: { baseLayer: layer } });
  };

  return {
    baseLayer: preferences.map.baseLayer,
    baseTileConfig,
    updateBaseLayer,
  };
};
