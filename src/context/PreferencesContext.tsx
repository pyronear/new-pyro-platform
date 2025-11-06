import { createContext } from 'react';

import type { UserPreferences } from '@/types/preferences';

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (partial: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}

export const PreferencesContext = createContext<
  PreferencesContextType | undefined
>(undefined);
