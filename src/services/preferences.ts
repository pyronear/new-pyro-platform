import { z } from 'zod';

export const UserPreferencesSchema = z.object({
  language: z.enum(['en', 'es', 'fr']),
  map: z.object({
    baseLayer: z.enum(['osm', 'ign', 'satellite']),
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
