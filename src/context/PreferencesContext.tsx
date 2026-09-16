import { createContext } from 'react';

import type { BaseLayerType } from '@/services/preferences';

export interface UserPreferences {
  language: string;
  map: {
    baseLayer: BaseLayerType;
  };
  audio: {
    alertsEnabled: boolean;
  };
}

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (partial: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}

export const PreferencesContext = createContext<
  PreferencesContextType | undefined
>(undefined);
