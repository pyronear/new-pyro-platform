import { createContext } from 'react';

import { type Role } from '@/utils/token';

export interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  hasRole: (role: Role) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
