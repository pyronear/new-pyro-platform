import { act, renderHook, waitFor } from '@testing-library/react';
import { AxiosError, type AxiosResponse } from 'axios';
import type { ReactNode } from 'react';

import { apiInstance } from '@/services/axios';
import { getAuthToken, setAuthToken, setAuthUsername } from '@/utils/authToken';

import { AuthProvider } from './AuthProvider';
import { useAuth } from './useAuth';

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    delete apiInstance.defaults.headers.common.Authorization;
  });

  afterEach(() => {
    localStorage.clear();
    delete apiInstance.defaults.headers.common.Authorization;
  });

  it('logs out and marks the session as expired when an authenticated request returns an auth error', async () => {
    setAuthToken('expired-token');
    setAuthUsername('test-user');

    const { result } = renderHook(() => useAuth(), { wrapper });

    const unauthorizedResponse = {
      status: 406,
      statusText: 'Not Acceptable',
      data: null,
      headers: {},
      config: {},
    } as AxiosResponse;
    const unauthorizedError = new AxiosError(
      'Invalid token',
      undefined,
      undefined,
      undefined,
      unauthorizedResponse
    );

    await act(async () => {
      await expect(
        apiInstance.get('/protected', {
          adapter: () => Promise.reject(unauthorizedError),
        })
      ).rejects.toThrow('Invalid token');
    });

    await waitFor(() => {
      expect(result.current.token).toBeNull();
    });
    expect(result.current.username).toBeNull();
    expect(result.current.hasExpiredSession).toBe(true);
    expect(getAuthToken()).toBeNull();
  });
});
