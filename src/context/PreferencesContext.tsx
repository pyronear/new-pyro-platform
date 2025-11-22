import { createContext } from 'react';

export interface UserPreferences {
  language: string;
  map: {
    baseLayer: 'osm' | 'ign' | 'satellite';
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
