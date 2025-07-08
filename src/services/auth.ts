import * as z from 'zod';

const apiLoginResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.literal('bearer'),
});

const baseUrl = import.meta.env.VITE_API_URL;

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
  const response = await fetch(`${baseUrl}/api/v1/login/creds`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    console.error('Login error:', await response.text());
    switch (response.status) {
      case 401:
        throw new LoginError('INVALID_CREDENTIALS');
      case 500:
        throw new LoginError('SERVER_ERROR');
      default:
        throw new LoginError('UNKNOWN_ERROR');
    }
  }
  try {
    const loginResponseBody = apiLoginResponseSchema.parse(
      await response.json()
    );
    return { token: loginResponseBody.access_token };
  } catch {
    throw new LoginError('INVALID_API_RESPONSE');
  }
};
