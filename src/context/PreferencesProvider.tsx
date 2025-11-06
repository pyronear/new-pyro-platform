import React, { useCallback, useEffect, useMemo, useState } from 'react';

import i18n from '@/i18n';
import { DEFAULT_PREFERENCES, type UserPreferences } from '@/types/preferences';
import {
  clearUserPreferences,
  getInitialPreferences,
  setUserPreferences,
} from '@/utils/preferences';

import { PreferencesContext } from './PreferencesContext';

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    return getInitialPreferences();
  });

  const updatePreferences = useCallback((partial: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...partial };
      setUserPreferences(updated);
      return updated;
    });
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    clearUserPreferences();
  }, []);

  useEffect(() => {
    void i18n.changeLanguage(preferences.language);
  }, [preferences.language]);

  const contextValue = useMemo(
    () => ({
      preferences,
      updatePreferences,
      resetPreferences,
    }),
    [preferences, updatePreferences, resetPreferences]
  );

  return (
    <PreferencesContext value={contextValue}>{children}</PreferencesContext>
  );
};
