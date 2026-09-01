import { createContext } from 'react';

interface AuthContextType {
  token: string | null;
  username: string | null;
  hasExpiredSession: boolean;
  clearExpiredSession: () => void;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
