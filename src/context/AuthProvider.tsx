import { AxiosError } from 'axios';
import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';

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

const SESSION_EXPIRED_STATUSES = new Set([401, 406]);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [username, setUsername] = useState<string | null>(() => {
    return getAuthUsername();
  });
  const [hasExpiredSession, setHasExpiredSession] = useState(false);
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
      setHasExpiredSession(false);
      setToken(token);
      setUsername(username);
    },
    [setToken]
  );

  const logout = useCallback(() => {
    clearAuthToken();
    clearAuthUsername();
    delete apiInstance.defaults.headers.common.Authorization;
    setHasExpiredSession(false);
    setToken(null);
    setUsername(null);
  }, [setToken]);

  const expireSession = useCallback(() => {
    clearAuthToken();
    clearAuthUsername();
    delete apiInstance.defaults.headers.common.Authorization;
    setHasExpiredSession(true);
    setToken(null);
    setUsername(null);
  }, []);

  const clearExpiredSession = useCallback(() => {
    setHasExpiredSession(false);
  }, []);

  useLayoutEffect(() => {
    const interceptorId = apiInstance.interceptors.response.use(
      (response) => response,
      (error: unknown) => {
        if (
          token &&
          error instanceof AxiosError &&
          SESSION_EXPIRED_STATUSES.has(error.response?.status ?? 0)
        ) {
          expireSession();
        }

        return Promise.reject(
          error instanceof Error ? error : new Error('API request failed')
        );
      }
    );

    return () => {
      apiInstance.interceptors.response.eject(interceptorId);
    };
  }, [expireSession, token]);

  const contextValue = useMemo(
    () => ({
      token,
      login,
      logout,
      username,
      hasExpiredSession,
      clearExpiredSession,
    }),
    [token, login, logout, username, hasExpiredSession, clearExpiredSession]
  );

  return <AuthContext value={contextValue}>{children}</AuthContext>;
};
