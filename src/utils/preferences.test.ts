import { DEFAULT_PREFERENCES } from '@/types/preferences';

import {
  clearUserPreferences,
  getInitialPreferences,
  getUserPreferences,
  setUserPreferences,
} from './preferences';

describe('preferences utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('setUserPreferences', () => {
    it('should save preferences to localStorage', () => {
      const prefs = { ...DEFAULT_PREFERENCES };
      setUserPreferences(prefs);

      const stored = localStorage.getItem('user_preferences');
      expect(stored).not.toBeNull();
      if (stored) {
        expect(JSON.parse(stored)).toEqual(prefs);
      }
    });

    it('should overwrite existing preferences', () => {
      setUserPreferences(DEFAULT_PREFERENCES);
      const updatedPrefs = {
        ...DEFAULT_PREFERENCES,
        language: 'fr' as const,
      };
      setUserPreferences(updatedPrefs);

      const retrieved = getUserPreferences();
      expect(retrieved).not.toBeNull();
      expect(retrieved?.language).toBe('fr');
    });
  });

  describe('getUserPreferences', () => {
    it('should return null if no preferences are stored', () => {
      expect(getUserPreferences()).toBeNull();
    });

    it('should retrieve stored preferences', () => {
      const prefs = { ...DEFAULT_PREFERENCES, language: 'es' as const };
      localStorage.setItem('user_preferences', JSON.stringify(prefs));

      const retrieved = getUserPreferences();
      expect(retrieved).toEqual(prefs);
    });

    it('should return null for invalid JSON', () => {
      localStorage.setItem('user_preferences', 'invalid json');
      expect(getUserPreferences()).toBeNull();
    });

    it('should return null for invalid schema', () => {
      localStorage.setItem(
        'user_preferences',
        JSON.stringify({ invalid: 'data' })
      );
      expect(getUserPreferences()).toBeNull();
    });

    it('should validate language enum values', () => {
      localStorage.setItem(
        'user_preferences',
        JSON.stringify({ ...DEFAULT_PREFERENCES, language: 'invalid' })
      );
      expect(getUserPreferences()).toBeNull();
    });

    it('should validate map baseLayer enum values', () => {
      localStorage.setItem(
        'user_preferences',
        JSON.stringify({
          ...DEFAULT_PREFERENCES,
          map: { baseLayer: 'invalid' },
        })
      );
      expect(getUserPreferences()).toBeNull();
    });
  });

  describe('clearUserPreferences', () => {
    it('should remove preferences from localStorage', () => {
      setUserPreferences(DEFAULT_PREFERENCES);
      expect(localStorage.getItem('user_preferences')).toBeTruthy();

      clearUserPreferences();
      expect(localStorage.getItem('user_preferences')).toBeNull();
    });

    it('should not throw if preferences do not exist', () => {
      expect(() => clearUserPreferences()).not.toThrow();
    });
  });

  describe('getInitialPreferences', () => {
    it('should return stored preferences if available', () => {
      const prefs = { ...DEFAULT_PREFERENCES, language: 'fr' as const };
      setUserPreferences(prefs);

      expect(getInitialPreferences()).toEqual(prefs);
    });

    it('should return default preferences if none are stored', () => {
      expect(getInitialPreferences()).toEqual(DEFAULT_PREFERENCES);
    });

    it('should return default preferences if stored data is invalid', () => {
      localStorage.setItem('user_preferences', 'invalid json');
      expect(getInitialPreferences()).toEqual(DEFAULT_PREFERENCES);
    });
  });
});
