import {
  setUserPreferences,
  type UserPreferencesDto,
} from '@/services/preferences';

import { getInitialPreferences } from './preferences';

const DEFAULT_PREFERENCES = {
  language: 'en',
  map: {
    baseLayer: 'osm',
  },
  audio: {
    alertsEnabled: false,
  },
};

describe('preferences utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getInitialPreferences', () => {
    it('should return stored preferences if available', () => {
      const prefs = {
        ...DEFAULT_PREFERENCES,
        language: 'fr',
      } as UserPreferencesDto;
      setUserPreferences(prefs);

      expect(getInitialPreferences(undefined)).toEqual(prefs);
    });

    it('should return default preferences if none are stored', () => {
      expect(getInitialPreferences(undefined)).toEqual(DEFAULT_PREFERENCES);
    });

    it('should return default preferences if stored data is invalid', () => {
      localStorage.setItem('user_preferences', 'invalid json');
      expect(getInitialPreferences(undefined)).toEqual(DEFAULT_PREFERENCES);
    });
    it('should return default preferences with custom language if language reoslved', () => {
      localStorage.setItem('user_preferences', 'invalid json');
      expect(getInitialPreferences('fr')).toEqual({
        ...DEFAULT_PREFERENCES,
        language: 'fr',
      });
    });
  });
});
