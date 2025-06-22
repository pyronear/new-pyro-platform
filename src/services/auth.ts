import * as z from 'zod';

const apiLoginResponseSchema = z.object({
  token: z.string(),
});

export const getToken = async (
  username: string,
  password: string
): Promise<{ token: string }> => {
  // TODO: which URL to use?
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }), // TODO: check if body ok
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
    return loginResponseBody;
  } catch {
    throw new Error('Api error: Login did not return a token');
  }
};
