import type { UserPreferences } from '@/context/PreferencesContext';
import { getUserPreferences } from '@/services/preferences';

export const getInitialPreferences = (
  resolvedLanguage: string | undefined
): UserPreferences => {
  const defaultLanguage = resolvedLanguage ?? DEFAULT_LANGUAGE;
  return getUserPreferences() ?? getDefaultPreferences(defaultLanguage);
};
export const DEFAULT_LANGUAGE = 'en';

const getDefaultPreferences = (defaultLanguage: string): UserPreferences => ({
  language: defaultLanguage,
  map: {
    baseLayer: 'osm',
  },
  audio: {
    alertsEnabled: false,
  },
});
