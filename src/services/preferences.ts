import { z } from 'zod';

export const BASE_LAYERS = ['osm', 'ign', 'satellite', 'topo_ign'] as const;

export type BaseLayerType = (typeof BASE_LAYERS)[number];

const MapOverlaysSchema = z.object({
  dfci: z.boolean(),
  onfForest: z.boolean(),
});

export type MapOverlays = z.infer<typeof MapOverlaysSchema>;

export const DEFAULT_MAP_OVERLAYS: MapOverlays = {
  dfci: false,
  onfForest: false,
};

export const UserPreferencesSchema = z.object({
  language: z.enum(['en', 'es', 'fr']),
  map: z.object({
    baseLayer: z.enum(BASE_LAYERS),
    // Preferences stored before overlays existed have no `overlays` key: they
    // must still load, otherwise every other preference falls back to default.
    overlays: MapOverlaysSchema.default(DEFAULT_MAP_OVERLAYS),
  }),
  audio: z.object({
    alertsEnabled: z.boolean(),
  }),
});

export type UserPreferencesDto = z.infer<typeof UserPreferencesSchema>;

const PREFERENCES_KEY = 'user_preferences';

export const setUserPreferences = (preferences: UserPreferencesDto): void => {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
};

export const getUserPreferences = (): UserPreferencesDto | null => {
  try {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (!stored) return null;

    return UserPreferencesSchema.parse(JSON.parse(stored));
  } catch (error) {
    console.error('Failed to load preferences:', error);
    return null;
  }
};

export const clearUserPreferences = (): void => {
  try {
    localStorage.removeItem(PREFERENCES_KEY);
  } catch (error) {
    console.error('Failed to clear preferences:', error);
  }
};
