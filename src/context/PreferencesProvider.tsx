import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  clearUserPreferences,
  setUserPreferences,
  type UserPreferencesDto,
} from '@/services/preferences';
import { getInitialPreferences } from '@/utils/preferences';

import { PreferencesContext, type UserPreferences } from './PreferencesContext';

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const initialPreferences: UserPreferences = useMemo(() => {
    return getInitialPreferences(i18n.resolvedLanguage);
  }, [i18n]);

  const [preferences, setPreferences] =
    useState<UserPreferences>(initialPreferences);

  const updatePreferences = useCallback((partial: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...partial } as UserPreferencesDto;
      setUserPreferences(updated);
      return updated;
    });
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(initialPreferences);
    clearUserPreferences();
  }, [initialPreferences]);

  useEffect(() => {
    void i18n.changeLanguage(preferences.language);
  }, [i18n, preferences.language]);

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
