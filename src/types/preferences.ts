export const DEFAULT_LANGUAGE = 'en' as const;

export interface UserPreferences {
  language: 'en' | 'fr' | 'es';
  map: {
    baseLayer: 'osm' | 'ign' | 'satellite';
  };
  audio: {
    alertsEnabled: boolean;
  };
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  language: DEFAULT_LANGUAGE,
  map: {
    baseLayer: 'osm',
  },
  audio: {
    alertsEnabled: false,
  },
};
