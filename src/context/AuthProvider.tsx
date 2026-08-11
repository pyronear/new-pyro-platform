import { useQueryClient } from '@tanstack/react-query';
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

  /*
   * Every cached response is scoped to the organization of the account that
   * fetched it, so it must not outlive that account's session: observers held
   * outside the protected routes keep their queries alive past logout, and
   * would otherwise serve the previous user's alerts to the next one.
   */
  const queryClient = useQueryClient();

  const login = useCallback(
    async (username: string, password: string) => {
      const { token } = await getToken(username, password);
      apiInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
      queryClient.clear();
      setAuthToken(token);
      setAuthUsername(username);
      setToken(token);
      setUsername(username);
    },
    [setToken, queryClient]
  );

  const logout = useCallback(() => {
    queryClient.clear();
    clearAuthToken();
    clearAuthUsername();
    setToken(null);
  }, [setToken, queryClient]);

  const contextValue = useMemo(
    () => ({ token, login, logout, username }),
    [token, login, logout, username]
  );

  return <AuthContext value={contextValue}>{children}</AuthContext>;
};
