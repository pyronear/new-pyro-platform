import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { getToken } from '../services/auth';
import { clearAuthToken, getAuthToken, setAuthToken } from '../utils/authToken';
import { AuthContext } from './AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const existingToken = getAuthToken();
    if (existingToken) {
      setToken(existingToken);
    }
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      const { token } = await getToken(username, password);
      setAuthToken(token);
      setToken(token);
    },
    [setToken]
  );

  const logout = useCallback(() => {
    clearAuthToken();
    setToken(null);
  }, [setToken]);

  const contextValue = useMemo(
    () => ({ token, login, logout }),
    [token, login, logout]
  );

  return <AuthContext value={contextValue}>{children}</AuthContext>;
};
