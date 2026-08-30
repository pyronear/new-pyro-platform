import { createContext } from 'react';

import type { Profil } from '@/utils/token.ts';

interface AuthContextType {
  token: string | null;
  username: string | null;
  profil: Profil | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
