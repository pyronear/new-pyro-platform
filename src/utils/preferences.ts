import { UserPreferencesSchema } from '@/services/preferences';
import { DEFAULT_PREFERENCES, type UserPreferences } from '@/types/preferences';

const PREFERENCES_KEY = 'user_preferences';

export const setUserPreferences = (preferences: UserPreferences): void => {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save preferences:', error);
  }
};

export const getUserPreferences = (): UserPreferences | null => {
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

export const getInitialPreferences = (): UserPreferences => {
  return getUserPreferences() ?? DEFAULT_PREFERENCES;
};
