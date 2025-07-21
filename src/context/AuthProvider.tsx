import React, { useCallback, useMemo, useState } from 'react';

import { getToken } from '../services/auth';
import { instance } from '../services/axios';
import { clearAuthToken, getAuthToken, setAuthToken } from '../utils/authToken';
import { AuthContext } from './AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => {
    const existingToken = getAuthToken();
    if (existingToken) {
      instance.defaults.headers.common.Authorization = `Bearer ${existingToken}`;
    }
    return existingToken;
  });

  const login = useCallback(
    async (username: string, password: string) => {
      const { token } = await getToken(username, password);
      instance.defaults.headers.common.Authorization = `Bearer ${token}`;
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
