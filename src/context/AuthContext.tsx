import { createContext } from 'react';

import { type Profil } from '@/utils/token';

export interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  hasProfil: (profil: Profil) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
