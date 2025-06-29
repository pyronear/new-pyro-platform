import * as z from 'zod';

const apiLoginResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.literal('bearer'),
});

const baseUrl = import.meta.env.VITE_API_URL;

export const getToken = async (
  username: string,
  password: string
): Promise<{ token: string }> => {
  const body = new URLSearchParams({ username, password });
  const response = await fetch(`${baseUrl}/login/creds`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  try {
    const loginResponseBody = apiLoginResponseSchema.parse(
      await response.json()
    );
    return { token: loginResponseBody.access_token };
  } catch {
    throw new Error('Api error: Login did not return a correct reponse');
  }
};
