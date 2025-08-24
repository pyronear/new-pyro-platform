import React, { useCallback, useMemo, useState } from 'react';

import { getToken } from '../services/auth';
import { apiInstance } from '../services/axios';
import {
  clearAuthToken,
  clearAuthUsername,
  getAuthToken,
  getAuthUsername,
  setAuthToken,
  setAuthUsername,
} from '../utils/authToken';
import { AuthContext } from './AuthContext';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [username, setUsername] = useState<string | null>(() => {
    return getAuthUsername();
  });
  const [token, setToken] = useState<string | null>(() => {
    const existingToken = getAuthToken();
    if (existingToken) {
      apiInstance.defaults.headers.common.Authorization = `Bearer ${existingToken}`;
    }

    return existingToken;
  });

  const login = useCallback(
    async (username: string, password: string) => {
      const { token } = await getToken(username, password);
      apiInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
      setAuthToken(token);
      setAuthUsername(username);
      setToken(token);
      setUsername(username);
    },
    [setToken]
  );

  const logout = useCallback(() => {
    clearAuthToken();
    clearAuthUsername();
    setToken(null);
  }, [setToken]);

  const contextValue = useMemo(
    () => ({ token, login, logout, username }),
    [token, login, logout, username]
  );

  return <AuthContext value={contextValue}>{children}</AuthContext>;
};
