import { AxiosError } from 'axios';
import * as z from 'zod';

import { instance } from './axios';

const apiLoginResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.literal('bearer'),
});

export type LoginErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR'
  | 'INVALID_API_RESPONSE';

export class LoginError extends Error {
  public code: LoginErrorCode;

  constructor(code: LoginErrorCode) {
    super(code);
    this.name = 'LoginError';
    this.code = code;
  }
}

export const getToken = async (
  username: string,
  password: string
): Promise<{ token: string }> => {
  const body = new URLSearchParams({ username, password });
  return instance
    .post('/api/v1/login/creds', body, {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    .then((response) => {
      try {
        const loginResponseBody = apiLoginResponseSchema.parse(response.data);
        instance.defaults.headers.common.Authorization = `Bearer ${loginResponseBody.access_token}`;
        return { token: loginResponseBody.access_token };
      } catch {
        throw new LoginError('INVALID_API_RESPONSE');
      }
    })
    .catch((error: unknown) => {
      console.error('Login error:', error);
      if (error instanceof LoginError) {
        throw error;
      }
      if (error instanceof AxiosError) {
        switch (error.status) {
          case 401:
            throw new LoginError('INVALID_CREDENTIALS');
          case 500:
            throw new LoginError('SERVER_ERROR');
          default:
            throw new LoginError('UNKNOWN_ERROR');
        }
      }
      throw new LoginError('UNKNOWN_ERROR');
    });
};
