import { act, renderHook } from '@testing-library/react';
import { type ReactNode } from 'react';

import i18n from '@/i18n';
import { DEFAULT_LANGUAGE, DEFAULT_PREFERENCES } from '@/types/preferences';
import { getUserPreferences, setUserPreferences } from '@/utils/preferences';

import { PreferencesProvider } from './PreferencesProvider';
import { usePreferences } from './usePreferences';

const wrapper = ({ children }: { children: ReactNode }) => (
  <PreferencesProvider>{children}</PreferencesProvider>
);

describe('PreferencesProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    void i18n.changeLanguage(DEFAULT_LANGUAGE);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('initialization', () => {
    it('should initialize with default preferences if none are stored', () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });

      expect(result.current.preferences).toEqual(DEFAULT_PREFERENCES);
    });

    it('should load preferences from localStorage on mount', () => {
      const storedPrefs = {
        ...DEFAULT_PREFERENCES,
        language: 'fr' as const,
        map: { baseLayer: 'satellite' as const },
      };
      setUserPreferences(storedPrefs);

      const { result } = renderHook(() => usePreferences(), { wrapper });

      expect(result.current.preferences).toEqual(storedPrefs);
    });

    it('should change language on mount based on stored preferences', () => {
      setUserPreferences({
        ...DEFAULT_PREFERENCES,
        language: DEFAULT_LANGUAGE,
      });

      renderHook(() => usePreferences(), { wrapper });

      expect(i18n.language).toBe(DEFAULT_LANGUAGE);
    });
  });

  describe('updatePreferences', () => {
    it('should update preferences and persist to localStorage', () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });

      act(() => {
        result.current.updatePreferences({ language: DEFAULT_LANGUAGE });
      });

      expect(result.current.preferences.language).toBe(DEFAULT_LANGUAGE);
      expect(getUserPreferences()?.language).toBe(DEFAULT_LANGUAGE);
    });

    it('should update nested map preferences', () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });

      act(() => {
        result.current.updatePreferences({
          map: { baseLayer: 'ign' },
        });
      });

      expect(result.current.preferences.map.baseLayer).toBe('ign');
      expect(getUserPreferences()?.map.baseLayer).toBe('ign');
    });

    it('should update audio preferences', () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });

      act(() => {
        result.current.updatePreferences({
          audio: { alertsEnabled: true },
        });
      });

      expect(result.current.preferences.audio.alertsEnabled).toBe(true);
      expect(getUserPreferences()?.audio.alertsEnabled).toBe(true);
    });

    it('should change i18n language when language preference updates', () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });

      act(() => {
        result.current.updatePreferences({ language: DEFAULT_LANGUAGE });
      });

      expect(i18n.language).toBe(DEFAULT_LANGUAGE);
    });

    it('should preserve other preferences when updating one field', () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });

      act(() => {
        result.current.updatePreferences({ language: DEFAULT_LANGUAGE });
      });

      act(() => {
        result.current.updatePreferences({
          map: { baseLayer: 'satellite' },
        });
      });

      expect(result.current.preferences.language).toBe(DEFAULT_LANGUAGE);
      expect(result.current.preferences.map.baseLayer).toBe('satellite');
    });
  });

  describe('resetPreferences', () => {
    it('should reset preferences to defaults', () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });

      act(() => {
        result.current.updatePreferences({ language: DEFAULT_LANGUAGE });
      });

      act(() => {
        result.current.resetPreferences();
      });

      expect(result.current.preferences).toEqual(DEFAULT_PREFERENCES);
    });

    it('should clear preferences from localStorage', () => {
      const { result } = renderHook(() => usePreferences(), { wrapper });

      act(() => {
        result.current.updatePreferences({ language: DEFAULT_LANGUAGE });
      });

      expect(getUserPreferences()).not.toBeNull();

      act(() => {
        result.current.resetPreferences();
      });

      expect(getUserPreferences()).toBeNull();
    });
  });

  describe('usePreferences hook', () => {
    it('should throw error when used outside PreferencesProvider', () => {
      expect(() => {
        renderHook(() => usePreferences());
      }).toThrow('usePreferences must be used within PreferencesProvider');
    });
  });
});
